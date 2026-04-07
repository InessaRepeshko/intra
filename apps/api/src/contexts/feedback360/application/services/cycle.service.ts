import {
    CreateCyclePayload,
    CYCLE_CONSTRAINTS,
    CycleSearchQuery,
    CycleStage,
    ReviewStage,
    SYSTEM_ACTOR,
    UpdateCyclePayload,
} from '@intra/shared-kernel';
import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/database/prisma.service';
import { CycleStageHistoryDomain } from '../../domain/cycle-stage-history.domain';
import { CycleDomain } from '../../domain/cycle.domain';
import {
    CYCLE_STAGE_TRANSITIONS,
    TRANSITION_REASONS,
} from '../constants/cycle-stage-transitions';
import { CycleStageChangedEvent } from '../events/cycle-stage-changed.event';
import {
    CYCLE_STAGE_HISTORY_REPOSITORY,
    CycleStageHistoryRepositoryPort,
} from '../ports/cycle-stage-history.repository.port';
import {
    CYCLE_REPOSITORY,
    CycleRepositoryPort,
} from '../ports/cycle.repository.port';
import {
    REVIEW_REPOSITORY,
    ReviewRepositoryPort,
} from '../ports/review.repository.port';

@Injectable()
export class CycleService {
    constructor(
        @Inject(CYCLE_REPOSITORY)
        private readonly cycles: CycleRepositoryPort,
        @Inject(CYCLE_STAGE_HISTORY_REPOSITORY)
        private readonly stageHistory: CycleStageHistoryRepositoryPort,
        @Inject(REVIEW_REPOSITORY)
        private readonly reviews: ReviewRepositoryPort,
        private readonly eventEmitter: EventEmitter2,
        private readonly prisma: PrismaService,
    ) {}

    async create(payload: CreateCyclePayload): Promise<CycleDomain> {
        const cycle = CycleDomain.create({
            title: payload.title,
            description: payload.description,
            hrId: payload.hrId,
            stage: payload.stage ?? CycleStage.NEW,
            minRespondentsThreshold:
                payload.minRespondentsThreshold ??
                CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN,
            isActive: payload.isActive ?? true,
            startDate: payload.startDate,
            reviewDeadline: payload.reviewDeadline,
            approvalDeadline: payload.approvalDeadline,
            responseDeadline: payload.responseDeadline,
            endDate: payload.endDate,
        });

        const created = await this.cycles.create(cycle);
        return this.getById(created.id!);
    }

    async search(query: CycleSearchQuery): Promise<CycleDomain[]> {
        return this.cycles.search(query);
    }

    async getById(id: number): Promise<CycleDomain> {
        const cycle = await this.cycles.findById(id);
        if (!cycle)
            throw new NotFoundException('Cycle with id ' + id + ' not found');
        return cycle;
    }

    async update(id: number, patch: UpdateCyclePayload): Promise<CycleDomain> {
        const cycle = await this.getById(id);

        if (
            cycle.stage !== CycleStage.NEW &&
            cycle.stage !== CycleStage.ACTIVE
        ) {
            throw new BadRequestException(
                'Cycle must be new or active to be updated. Current stage: ' +
                    cycle.stage,
            );
        }

        const payload: UpdateCyclePayload = {
            ...(patch.title !== undefined ? { title: patch.title } : {}),
            ...(patch.description !== undefined
                ? { description: patch.description }
                : {}),
            ...(patch.hrId !== undefined ? { hrId: patch.hrId } : {}),
            ...(patch.isActive !== undefined
                ? { isActive: patch.isActive }
                : {}),
            ...(patch.startDate !== undefined
                ? { startDate: patch.startDate }
                : {}),
            ...(patch.reviewDeadline !== undefined
                ? { reviewDeadline: patch.reviewDeadline }
                : {}),
            ...(patch.approvalDeadline !== undefined
                ? { approvalDeadline: patch.approvalDeadline }
                : {}),
            ...(patch.responseDeadline !== undefined
                ? { responseDeadline: patch.responseDeadline }
                : {}),
            ...(patch.endDate !== undefined ? { endDate: patch.endDate } : {}),
        };

        const updated = await this.cycles.updateById(id, payload);

        // Reactive Trigger: Check if all responses completed
        if (patch.stage && patch.stage === CycleStage.FINISHED) {
            await this.completeCycle(id);
        }

        if (patch.stage && patch.stage !== CycleStage.PUBLISHED) {
            await this.changeStage(
                id,
                patch.stage,
                SYSTEM_ACTOR.ID,
                SYSTEM_ACTOR.NAME,
                TRANSITION_REASONS.CYCLE_UPDATED,
            );
        }

        return updated;
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        await this.cycles.deleteById(id);
    }

    /**
     * Centralized method for stage transitions with validation and history tracking
     * @param cycleId ID of the cycle
     * @param nextStage Target stage
     * @param actorId User ID who initiated the change (0 for system)
     * @param actorName Full name of the actor
     * @param reason Optional reason for the transition
     */
    async changeStage(
        cycleId: number,
        nextStage: CycleStage,
        actorId: number = SYSTEM_ACTOR.ID,
        actorName: string | null = SYSTEM_ACTOR.NAME,
        reason?: string,
    ): Promise<void> {
        const cycle = await this.getById(cycleId);
        const currentStage = cycle.stage;

        // Validate transition is allowed
        const allowedTransitions = CYCLE_STAGE_TRANSITIONS[currentStage];

        if (!allowedTransitions.includes(nextStage)) {
            throw new BadRequestException(
                `Invalid cycle stage transition from ${currentStage} to ${nextStage}`,
            );
        }

        // Perform update and history logging in a transaction
        await this.prisma.$transaction(async (tx) => {
            // Update cycle stage
            await tx.cycle.update({
                where: { id: cycleId },
                data: { stage: nextStage },
            });

            // Create history record
            const history = CycleStageHistoryDomain.create({
                cycleId,
                fromStage: currentStage,
                toStage: nextStage,
                changedById: actorId || null,
                changedByName: actorName,
                reason,
            });

            await this.stageHistory.create(history);
        });

        // Emit event for listeners to react
        this.eventEmitter.emit(
            'cycle.stage.changed',
            new CycleStageChangedEvent(
                cycleId,
                currentStage,
                nextStage,
                actorId,
                actorName,
                reason,
            ),
        );
    }

    /**
     * Get stage change history for a cycle
     */
    async getStageHistory(cycleId: number): Promise<CycleStageHistoryDomain[]> {
        return this.stageHistory.findByCycleId(cycleId);
    }

    /**
     * REACTIVE TRIGGER: Checks if all review for a cycle have collected.
     * If yes, automatically transitions the cycle to the FINISHED stage.
     * @param cycleId The cycle identifier.
     */
    async completeCycle(cycleId: number): Promise<void> {
        const cycle = await this.getById(cycleId);

        // Get all reviews for this cycle
        const reviews = await this.reviews.listByCycleId(cycleId);

        // Check if there are any in-progress reviews
        const incompleteReviews = reviews.filter(
            (r) =>
                r.stage === ReviewStage.SELF_ASSESSMENT ||
                r.stage === ReviewStage.IN_PROGRESS,
        );
        const hasInProgressReviews = incompleteReviews.length > 0;

        // If no in-progress reviews, trigger report generation
        if (!hasInProgressReviews && reviews.length > 0) {
            await this.changeStage(
                cycleId,
                CycleStage.FINISHED,
                SYSTEM_ACTOR.ID,
                SYSTEM_ACTOR.NAME,
                TRANSITION_REASONS.ALL_REVIEWS_COLLECTED,
            );
        } else {
            throw new BadRequestException(
                'All reviews must be completed to finish the cycle. Incomplete reviews count: ' +
                    incompleteReviews.length,
            );
        }
    }

    /**
     * MANUAL TRIGGER: HR or ADMIN force-finishes a cycle
     * Transitions cycle to FINISHED regardless of in-progress reviews
     */
    async forceFinish(
        cycleId: number,
        actorId: number = SYSTEM_ACTOR.ID,
        actorName: string | null = SYSTEM_ACTOR.NAME,
    ): Promise<void> {
        await this.getById(cycleId);
        await this.changeStage(
            cycleId,
            CycleStage.FINISHED,
            actorId,
            actorName,
            TRANSITION_REASONS.FORCE_FINISH,
        );
    }
}
