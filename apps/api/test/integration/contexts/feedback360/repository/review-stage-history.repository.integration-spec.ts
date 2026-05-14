import '../../../setup-env';

import { ReviewStage } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ReviewStageHistoryDomain } from 'src/contexts/feedback360/domain/review-stage-history.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { ReviewStageHistoryRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review-stage-history.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('ReviewStageHistoryRepository (integration)', () => {
    let module: TestingModule;
    let repo: ReviewStageHistoryRepository;
    let reviews: ReviewRepository;
    let cycles: CycleRepository;
    let positions: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let reviewId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        repo = module.get(ReviewStageHistoryRepository);
        reviews = module.get(ReviewRepository);
        cycles = module.get(CycleRepository);
        positions = module.get(PositionRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetFeedback360Tables(prisma);
        const hr = await identityUsers.create({
            firstName: 'Helena',
            lastName: 'Reed',
            email: `hr.${Date.now()}@example.com`,
        } as any);
        const ratee = await identityUsers.create({
            firstName: 'Robert',
            lastName: 'Smith',
            email: `ratee.${Date.now()}@example.com`,
        } as any);
        const position = await positions.create(
            PositionDomain.create({ title: 'Engineer' }),
        );
        const cycle = await cycles.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hr.id!,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );
        const review = await reviews.create(
            ReviewDomain.create({
                rateeId: ratee.id!,
                rateeFullName: 'Robert Smith',
                rateePositionId: position.id!,
                rateePositionTitle: 'Engineer',
                hrId: hr.id!,
                hrFullName: 'Helena Reed',
                cycleId: cycle.id!,
                stage: ReviewStage.NEW,
            }),
        );
        reviewId = review.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create', () => {
        it('persists a history row', async () => {
            const created = await repo.create(
                ReviewStageHistoryDomain.create({
                    reviewId,
                    fromStage: ReviewStage.NEW,
                    toStage: ReviewStage.IN_PROGRESS,
                    changedByName: 'system',
                    reason: 'manual trigger',
                }),
            );

            expect(created.id).toBeDefined();
            expect(created.fromStage).toBe(ReviewStage.NEW);
            expect(created.toStage).toBe(ReviewStage.IN_PROGRESS);
        });
    });

    describe('findByReviewId', () => {
        it('returns rows in ascending createdAt order', async () => {
            await repo.create(
                ReviewStageHistoryDomain.create({
                    reviewId,
                    fromStage: ReviewStage.NEW,
                    toStage: ReviewStage.IN_PROGRESS,
                }),
            );
            await repo.create(
                ReviewStageHistoryDomain.create({
                    reviewId,
                    fromStage: ReviewStage.IN_PROGRESS,
                    toStage: ReviewStage.FINISHED,
                }),
            );

            const rows = await repo.findByReviewId(reviewId);

            expect(rows.map((r) => r.toStage)).toEqual([
                ReviewStage.IN_PROGRESS,
                ReviewStage.FINISHED,
            ]);
        });

        it('returns an empty array when no history exists', async () => {
            await expect(repo.findByReviewId(reviewId)).resolves.toEqual([]);
        });
    });

    describe('findById', () => {
        it('returns the row when found', async () => {
            const created = await repo.create(
                ReviewStageHistoryDomain.create({
                    reviewId,
                    fromStage: ReviewStage.NEW,
                    toStage: ReviewStage.IN_PROGRESS,
                }),
            );

            await expect(repo.findById(created.id!)).resolves.toBeInstanceOf(
                ReviewStageHistoryDomain,
            );
        });

        it('returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });
});
