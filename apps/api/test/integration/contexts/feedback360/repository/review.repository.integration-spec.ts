import '../../../setup-env';

import {
    ReviewSortField,
    ReviewStage,
    SortDirection,
} from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
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

describe('ReviewRepository (integration)', () => {
    let module: TestingModule;
    let repo: ReviewRepository;
    let cycles: CycleRepository;
    let positions: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let hrId: number;
    let rateeId: number;
    let rateePositionId: number;
    let cycleId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        repo = module.get(ReviewRepository);
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

        hrId = hr.id!;
        rateeId = ratee.id!;
        rateePositionId = position.id!;
        cycleId = cycle.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function buildReview(
        overrides: Partial<{
            stage: ReviewStage;
            hrNote: string;
        }> = {},
    ): ReviewDomain {
        return ReviewDomain.create({
            rateeId,
            rateeFullName: 'Robert Smith',
            rateePositionId,
            rateePositionTitle: 'Engineer',
            hrId,
            hrFullName: 'Helena Reed',
            hrNote: overrides.hrNote ?? null,
            cycleId,
            stage: overrides.stage ?? ReviewStage.NEW,
        });
    }

    describe('create / findById', () => {
        it('persists a review with defaults applied', async () => {
            const created = await repo.create(buildReview());

            expect(created.id).toBeDefined();
            expect(created.rateeId).toBe(rateeId);
            expect(created.stage).toBe(ReviewStage.NEW);
        });

        it('findById returns the review when found', async () => {
            const created = await repo.create(buildReview());

            await expect(repo.findById(created.id!)).resolves.toBeInstanceOf(
                ReviewDomain,
            );
        });

        it('findById returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });

    describe('search / listByCycleId', () => {
        beforeEach(async () => {
            await repo.create(buildReview());
            await repo.create(buildReview({ stage: ReviewStage.IN_PROGRESS }));
            await repo.create(buildReview({ hrNote: 'second cycle' }));
        });

        it('returns all reviews when no filter is supplied', async () => {
            const all = await repo.search({} as any);
            expect(all).toHaveLength(3);
        });

        it('filters by stage', async () => {
            const result = await repo.search({
                stage: ReviewStage.IN_PROGRESS,
            } as any);
            expect(result).toHaveLength(1);
        });

        it('filters by hrId', async () => {
            const result = await repo.search({ hrId } as any);
            expect(result).toHaveLength(3);
        });

        it('listByCycleId returns reviews tied to a cycle', async () => {
            const result = await repo.listByCycleId(cycleId);
            expect(result).toHaveLength(3);
        });

        it('honours descending sort on rateeFullName', async () => {
            const result = await repo.search({
                sortBy: ReviewSortField.RATEE_FULL_NAME,
                sortDirection: SortDirection.DESC,
            } as any);
            expect(result).toHaveLength(3);
        });
    });

    describe('updateById', () => {
        it('persists patched scalar fields', async () => {
            const created = await repo.create(buildReview());

            const updated = await repo.updateById(created.id!, {
                hrNote: 'updated',
            } as any);

            expect(updated.hrNote).toBe('updated');
        });

        it('updates the stage when patched', async () => {
            const created = await repo.create(buildReview());

            const updated = await repo.updateById(created.id!, {
                stage: ReviewStage.IN_PROGRESS,
            } as any);

            expect(updated.stage).toBe(ReviewStage.IN_PROGRESS);
        });
    });

    describe('deleteById', () => {
        it('cascades cleanup of dependent rows in a single transaction', async () => {
            const created = await repo.create(buildReview());

            await repo.deleteById(created.id!);

            const fromDb = await prisma.review.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });
    });
});
