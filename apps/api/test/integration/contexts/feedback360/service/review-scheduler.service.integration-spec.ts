import '../../../setup-env';

import { CycleStage, ReviewStage } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import { ReviewSchedulerService } from 'src/contexts/feedback360/application/services/review-scheduler.service';
import { ReviewService } from 'src/contexts/feedback360/application/services/review.service';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('ReviewSchedulerService (integration)', () => {
    let module: TestingModule;
    let scheduler: ReviewSchedulerService;
    let reviewRepo: ReviewRepository;
    let cycleRepo: CycleRepository;
    let cycles: CycleService;
    let reviews: ReviewService;
    let identityUsers: IdentityUserService;
    let positions: PositionService;
    let prisma: PrismaService;

    let hrId: number;
    let rateeId: number;
    let positionId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        scheduler = module.get(ReviewSchedulerService);
        reviewRepo = module.get(ReviewRepository);
        cycleRepo = module.get(CycleRepository);
        cycles = module.get(CycleService);
        reviews = module.get(ReviewService);
        identityUsers = module.get(IdentityUserService);
        positions = module.get(PositionService);
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
        const position = await positions.create({ title: 'Engineer' });

        hrId = hr.id!;
        rateeId = ratee.id!;
        positionId = position.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    async function createCycle(
        overrides: Partial<{
            stage: CycleStage;
            responseDeadline: Date | null;
            endDate: Date;
        }> = {},
    ): Promise<number> {
        // The CycleService.create() path doesn't accept `stage`, so insert
        // through the repo when the test needs a non-NEW cycle.
        const cycle = await cycleRepo.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId,
                stage: overrides.stage ?? CycleStage.ACTIVE,
                isActive: true,
                startDate: new Date('2026-01-01'),
                endDate: overrides.endDate ?? new Date('2027-01-01'),
                responseDeadline:
                    overrides.responseDeadline === undefined
                        ? null
                        : overrides.responseDeadline,
            }),
        );
        return cycle.id!;
    }

    async function createReview(
        cycleId: number,
        stage: ReviewStage = ReviewStage.IN_PROGRESS,
    ): Promise<number> {
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

    describe('checkReviewDeadlines', () => {
        it('transitions IN_PROGRESS reviews to FINISHED when responseDeadline has passed', async () => {
            const cycleId = await createCycle({
                responseDeadline: new Date('2020-01-01'), // in the past
            });
            const reviewId = await createReview(cycleId);

            await scheduler.checkReviewDeadlines();

            const reloaded = await reviews.getById(reviewId);
            expect(reloaded.stage).toBe(ReviewStage.FINISHED);

            const history = await reviews.getStageHistory(reviewId);
            expect(history).toHaveLength(1);
            expect(history[0].toStage).toBe(ReviewStage.FINISHED);
        });

        it('does nothing when the responseDeadline is in the future', async () => {
            const cycleId = await createCycle({
                responseDeadline: new Date('2099-01-01'), // far future
            });
            const reviewId = await createReview(cycleId);

            await scheduler.checkReviewDeadlines();

            const reloaded = await reviews.getById(reviewId);
            expect(reloaded.stage).toBe(ReviewStage.IN_PROGRESS);
        });

        it('skips cycles without a responseDeadline', async () => {
            const cycleId = await createCycle({ responseDeadline: null });
            const reviewId = await createReview(cycleId);

            await scheduler.checkReviewDeadlines();

            const reloaded = await reviews.getById(reviewId);
            expect(reloaded.stage).toBe(ReviewStage.IN_PROGRESS);
        });

        it('only affects reviews in IN_PROGRESS stage', async () => {
            const cycleId = await createCycle({
                responseDeadline: new Date('2020-01-01'),
            });
            // A NEW review under the same overdue cycle should not be touched.
            const newReviewId = await createReview(cycleId, ReviewStage.NEW);

            await scheduler.checkReviewDeadlines();

            const reloaded = await reviews.getById(newReviewId);
            expect(reloaded.stage).toBe(ReviewStage.NEW);
        });
    });

    describe('checkCycleDeadlines', () => {
        it('force-finishes an ACTIVE cycle whose endDate has passed', async () => {
            const cycleId = await createCycle({
                stage: CycleStage.ACTIVE,
                endDate: new Date('2020-01-01'),
            });

            await scheduler.checkCycleDeadlines();

            const reloaded = await cycles.getById(cycleId);
            expect(reloaded.stage).toBe(CycleStage.FINISHED);
        });

        it('does nothing when both endDate and responseDeadline are in the future', async () => {
            const cycleId = await createCycle({
                stage: CycleStage.ACTIVE,
                endDate: new Date('2099-01-01'),
                responseDeadline: new Date('2099-01-01'),
            });

            await scheduler.checkCycleDeadlines();

            const reloaded = await cycles.getById(cycleId);
            expect(reloaded.stage).toBe(CycleStage.ACTIVE);
        });
    });
});
