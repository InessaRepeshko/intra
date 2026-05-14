import '../../../setup-env';

import {
    ReviewerSortField,
    ReviewStage,
    SortDirection,
} from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { ReviewerDomain } from 'src/contexts/feedback360/domain/reviewer.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { ReviewerRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/reviewer.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('ReviewerRepository (integration)', () => {
    let module: TestingModule;
    let repo: ReviewerRepository;
    let reviews: ReviewRepository;
    let cycles: CycleRepository;
    let positions: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let reviewId: number;
    let reviewerUserId: number;
    let positionId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        repo = module.get(ReviewerRepository);
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
        const reviewer = await identityUsers.create({
            firstName: 'Sara',
            lastName: 'Lopez',
            email: `reviewer.${Date.now()}@example.com`,
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
        reviewerUserId = reviewer.id!;
        positionId = position.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create', () => {
        it('persists a reviewer row', async () => {
            const created = await repo.create(
                ReviewerDomain.create({
                    reviewId,
                    reviewerId: reviewerUserId,
                    fullName: 'Sara Lopez',
                    positionId,
                    positionTitle: 'Engineer',
                }),
            );

            expect(created.id).toBeDefined();
            expect(created.reviewerId).toBe(reviewerUserId);
        });
    });

    describe('listByReview', () => {
        it('returns reviewers for a given review', async () => {
            await repo.create(
                ReviewerDomain.create({
                    reviewId,
                    reviewerId: reviewerUserId,
                    fullName: 'Sara Lopez',
                    positionId,
                    positionTitle: 'Engineer',
                }),
            );

            const result = await repo.listByReview(reviewId, {} as any);

            expect(result).toHaveLength(1);
            expect(result[0].fullName).toBe('Sara Lopez');
        });

        it('filters by fullName (case insensitive)', async () => {
            await repo.create(
                ReviewerDomain.create({
                    reviewId,
                    reviewerId: reviewerUserId,
                    fullName: 'Sara Lopez',
                    positionId,
                    positionTitle: 'Engineer',
                }),
            );

            const result = await repo.listByReview(reviewId, {
                fullName: 'SARA',
            } as any);

            expect(result).toHaveLength(1);
        });

        it('honours sort direction', async () => {
            await repo.create(
                ReviewerDomain.create({
                    reviewId,
                    reviewerId: reviewerUserId,
                    fullName: 'Aa Person',
                    positionId,
                    positionTitle: 'Engineer',
                }),
            );

            const second = await identityUsers.create({
                firstName: 'Zz',
                lastName: 'Person',
                email: `second.${Date.now()}@example.com`,
            } as any);
            await repo.create(
                ReviewerDomain.create({
                    reviewId,
                    reviewerId: second.id!,
                    fullName: 'Zz Person',
                    positionId,
                    positionTitle: 'Engineer',
                }),
            );

            const result = await repo.listByReview(reviewId, {
                sortBy: ReviewerSortField.FULL_NAME,
                sortDirection: SortDirection.DESC,
            } as any);

            expect(result.map((r) => r.fullName)).toEqual([
                'Zz Person',
                'Aa Person',
            ]);
        });
    });

    describe('deleteById', () => {
        it('removes the reviewer row', async () => {
            const created = await repo.create(
                ReviewerDomain.create({
                    reviewId,
                    reviewerId: reviewerUserId,
                    fullName: 'Sara Lopez',
                    positionId,
                    positionTitle: 'Engineer',
                }),
            );

            await repo.deleteById(created.id!);

            const fromDb = await prisma.reviewer.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });
    });
});
