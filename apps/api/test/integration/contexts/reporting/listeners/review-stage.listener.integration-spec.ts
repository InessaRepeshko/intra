import '../../../setup-env';

import { ReviewStage } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { ReviewStageProcessedEvent } from 'src/contexts/feedback360/application/events/review-stage-processed.event';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { ReviewStageListener } from 'src/contexts/reporting/application/listeners/review-stage.listener';
import { ReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('ReviewStageListener (reporting, integration)', () => {
    let module: TestingModule;
    let listener: ReviewStageListener;
    let cycleRepo: CycleRepository;
    let reviewRepo: ReviewRepository;
    let reportRepo: ReportRepository;
    let positionRepo: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    let hrId: number;
    let rateeId: number;
    let positionId: number;
    let cycleId: number;

    beforeAll(async () => {
        module = await createReportingTestModule();
        listener = module.get(ReviewStageListener);
        cycleRepo = module.get(CycleRepository);
        reviewRepo = module.get(ReviewRepository);
        reportRepo = module.get(ReportRepository);
        positionRepo = module.get(PositionRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetReportingTables(prisma);
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
        const cycle = await cycleRepo.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hr.id!,
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

    describe('handleReviewStageProcessed', () => {
        it('does nothing when currentStage is not FINISHED', async () => {
            const reviewId = await createReview(ReviewStage.IN_PROGRESS);

            await listener.handleReviewStageProcessed(
                new ReviewStageProcessedEvent(
                    reviewId,
                    ReviewStage.IN_PROGRESS,
                ),
            );

            const reviewAfter = await reviewRepo.findById(reviewId);
            expect(reviewAfter!.stage).toBe(ReviewStage.IN_PROGRESS);

            const report = await reportRepo.findByReviewId(reviewId);
            expect(report).toBeNull();
        });

        it('drives review FINISHED → PREPARING_REPORT → PROCESSING_BY_HR and generates an individual report', async () => {
            const reviewId = await createReview(ReviewStage.FINISHED);

            await listener.handleReviewStageProcessed(
                new ReviewStageProcessedEvent(reviewId, ReviewStage.FINISHED),
            );

            const reviewAfter = await reviewRepo.findById(reviewId);
            expect(reviewAfter!.stage).toBe(ReviewStage.PROCESSING_BY_HR);

            const report = await reportRepo.findByReviewId(reviewId);
            expect(report).not.toBeNull();
            expect(report!.reviewId).toBe(reviewId);

            // The review should also have its reportId set back to the
            // newly-created report.
            expect(reviewAfter!.reportId).toBe(report!.id);
        });
    });
});
