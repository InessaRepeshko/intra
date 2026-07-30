import {
    CycleStage,
    IdentityRole,
    ReviewStage,
    SYSTEM_ACTOR,
} from '@intra/shared-kernel';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { TRANSITION_REASONS } from '../constants/review-stage-transitions';
import { CycleService } from './cycle.service';
import { ReviewService } from './review.service';

/**
 * Synthetic actor used by the scheduler when calling access-checked
 * methods on `ReviewService`
 */
const SYSTEM_USER = UserDomain.create({
    id: SYSTEM_ACTOR.ID,
    firstName: SYSTEM_ACTOR.NAME,
    lastName: '',
    email: 'system@intra.local',
    roles: [IdentityRole.ADMIN],
});

/**
 * Scheduled service for checking review deadlines.
 * Runs periodically to transition reviews to FINISHED once their cycle's
 * `responseDeadline` has passed. The review state machine only allows
 * IN_PROGRESS → FINISHED | CANCELED — moving directly to PREPARING_REPORT
 * is not a valid transition, so the deadline trigger lands the review in
 * FINISHED and the report-generation flow takes it from there.
 */
@Injectable()
export class ReviewSchedulerService {
    private readonly logger = new Logger(ReviewSchedulerService.name);

    constructor(
        private readonly reviewService: ReviewService,
        private readonly cycleService: CycleService,
    ) {}

    /**
     * SCHEDULED TRIGGER: Check for reviews past their deadline
     * Runs every day at 7am to find reviews that should be completed
     */
    @Cron(CronExpression.EVERY_DAY_AT_7AM)
    async checkReviewDeadlines(): Promise<void> {
        this.logger.log('Checking for reviews past deadline...');

        try {
            // Get all active cycles
            const cycles = await this.cycleService.search({
                isActive: true,
            });

            for (const cycle of cycles) {
                if (!cycle.responseDeadline) {
                    continue;
                }

                const now = new Date();
                const deadline = new Date(cycle.responseDeadline);

                // If deadline has passed
                if (now > deadline) {
                    // Find all reviews in this cycle that are still IN_PROGRESS.
                    const reviews = await this.reviewService.search(
                        {
                            cycleId: cycle.id!,
                            stage: ReviewStage.IN_PROGRESS,
                        },
                        SYSTEM_USER,
                    );

                    this.logger.log(
                        `Found ${reviews.length} reviews past deadline in cycle #${cycle.id}`,
                    );

                    // Transition each review to FINISHED
                    for (const review of reviews) {
                        try {
                            await this.reviewService.changeReviewStage(
                                review.id!,
                                ReviewStage.FINISHED,
                                SYSTEM_ACTOR.ID,
                                SYSTEM_ACTOR.NAME,
                                TRANSITION_REASONS.DEADLINE_REACHED,
                            );
                            this.logger.log(
                                `Transitioned review #${review.id} to FINISHED (deadline)`,
                            );
                        } catch (error) {
                            this.logger.error(
                                `Failed to transition review #${review.id}: ${error.message}`,
                            );
                        }
                    }
                }
            }
        } catch (error) {
            this.logger.error(
                `Error checking review deadlines: ${error.message}`,
            );
        }
    }

    /**
     * SCHEDULED TRIGGER: Finish cycles past their deadlines
     * Runs every day at 7am to find cycles that should be finished
     */
    @Cron(CronExpression.EVERY_DAY_AT_7AM)
    async checkCycleDeadlines(): Promise<void> {
        this.logger.log('Checking for cycles past deadline...');

        try {
            const cycles = await this.cycleService.search({
                stage: CycleStage.ACTIVE,
                isActive: true,
            });

            const now = new Date();

            for (const cycle of cycles) {
                const endDatePassed =
                    cycle.endDate && new Date(cycle.endDate) < now;
                const responseDeadlinePassed =
                    cycle.responseDeadline &&
                    new Date(cycle.responseDeadline) < now;

                if (!endDatePassed && !responseDeadlinePassed) {
                    continue;
                }

                try {
                    await this.cycleService.forceFinish(cycle.id!);
                    this.logger.log(
                        `Finished cycle #${cycle.id} (deadline reached)`,
                    );
                } catch (error) {
                    this.logger.error(
                        `Failed to finish cycle #${cycle.id}: ${error.message}`,
                    );
                }
            }
        } catch (error) {
            this.logger.error(
                `Error checking cycle deadlines: ${error.message}`,
            );
        }
    }
}
