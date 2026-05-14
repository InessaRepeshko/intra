import '../../../setup-env';

import { CycleStage, ReviewStage } from '@intra/shared-kernel';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TestingModule } from '@nestjs/testing';
import { ReviewStageChangedEvent } from 'src/contexts/feedback360/application/events/review-stage-changed.event';
import { ReviewStageListener } from 'src/contexts/feedback360/application/listeners/review-stage.listener';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('ReviewStageListener (feedback360, integration)', () => {
    let module: TestingModule;
    let listener: ReviewStageListener;
    let cycleRepo: CycleRepository;
    let reviewRepo: ReviewRepository;
    let positionRepo: PositionRepository;
    let identityUsers: IdentityUserService;
    let eventEmitter: EventEmitter2;
    let prisma: PrismaService;

    let hrId: number;
    let rateeId: number;
    let positionId: number;
    let cycleId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        listener = module.get(ReviewStageListener);
        cycleRepo = module.get(CycleRepository);
        reviewRepo = module.get(ReviewRepository);
        positionRepo = module.get(PositionRepository);
        identityUsers = module.get(IdentityUserService);
        eventEmitter = module.get(EventEmitter2);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetFeedback360Tables(prisma);
        const hr = await identityUsers.create({
            firstName: 'Helena',
            lastName: 'Reed',
            email: `hr.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        const ratee = await identityUsers.create({
            firstName: 'Robert',
            lastName: 'Smith',
            email: `ratee.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        const position = await positionRepo.create(
            PositionDomain.create({ title: 'Engineer' }),
        );
        // Manually persist the cycle in ACTIVE stage so completeCycle()
        // is allowed to transition NEW → ... well ACTIVE → FINISHED.
        const cycle = await cycleRepo.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hr.id!,
                stage: CycleStage.ACTIVE,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );

        hrId = hr.id!;
        rateeId = ratee.id!;
        positionId = position.id!;
        cycleId = cycle.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    async function createReview(stage: ReviewStage): Promise<number> {
        const review = await reviewRepo.create(
            ReviewDomain.create({
                rateeId,
                rateeFullName: 'Robert Smith',
                rateePositionId: positionId,
                rateePositionTitle: 'Engineer',
                hrId,
                hrFullName: 'Helena Reed',
                cycleId,
                stage,
            }),
        );
        return review.id!;
    }

    describe('handleReviewStageChanged', () => {
        it('does nothing when toStage is not FINISHED and emits review.stage.processed', async () => {
            const reviewId = await createReview(ReviewStage.NEW);
            const processedEvents: any[] = [];
            eventEmitter.on('review.stage.processed', (e) =>
                processedEvents.push(e),
            );

            await listener.handleReviewStageChanged(
                new ReviewStageChangedEvent(
                    reviewId,
                    ReviewStage.NEW,
                    ReviewStage.SELF_ASSESSMENT,
                ),
            );

            expect(processedEvents).toHaveLength(1);
            expect(processedEvents[0].currentStage).toBe(
                ReviewStage.SELF_ASSESSMENT,
            );

            const cycleAfter = await cycleRepo.findById(cycleId);
            expect(cycleAfter!.stage).toBe(CycleStage.ACTIVE);
        });

        it('completes the cycle when this is the last active review in it', async () => {
            const reviewId = await createReview(ReviewStage.FINISHED);

            await listener.handleReviewStageChanged(
                new ReviewStageChangedEvent(
                    reviewId,
                    ReviewStage.IN_PROGRESS,
                    ReviewStage.FINISHED,
                ),
            );

            const cycleAfter = await cycleRepo.findById(cycleId);
            expect(cycleAfter!.stage).toBe(CycleStage.FINISHED);
        });

        it('does not complete the cycle when other reviews are still in progress', async () => {
            const finishedReviewId = await createReview(ReviewStage.FINISHED);
            await createReview(ReviewStage.IN_PROGRESS);

            await listener.handleReviewStageChanged(
                new ReviewStageChangedEvent(
                    finishedReviewId,
                    ReviewStage.IN_PROGRESS,
                    ReviewStage.FINISHED,
                ),
            );

            const cycleAfter = await cycleRepo.findById(cycleId);
            expect(cycleAfter!.stage).toBe(CycleStage.ACTIVE);
        });

        it('still emits review.stage.processed when the review has no cycle attached', async () => {
            // Review with cycleId=null
            const orphanReview = await reviewRepo.create(
                ReviewDomain.create({
                    rateeId,
                    rateeFullName: 'Robert Smith',
                    rateePositionId: positionId,
                    rateePositionTitle: 'Engineer',
                    hrId,
                    hrFullName: 'Helena Reed',
                    cycleId: null,
                    stage: ReviewStage.FINISHED,
                }),
            );
            const processedEvents: any[] = [];
            eventEmitter.on('review.stage.processed', (e) =>
                processedEvents.push(e),
            );

            await listener.handleReviewStageChanged(
                new ReviewStageChangedEvent(
                    orphanReview.id!,
                    ReviewStage.IN_PROGRESS,
                    ReviewStage.FINISHED,
                ),
            );

            expect(processedEvents).toHaveLength(1);
        });
    });
});
