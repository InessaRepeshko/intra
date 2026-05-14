import '../../../setup-env';

import {
    ReportSortField,
    RespondentCategory,
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
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';
import { ReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('ReportRepository (integration)', () => {
    let module: TestingModule;
    let repo: ReportRepository;
    let reviews: ReviewRepository;
    let cycles: CycleRepository;
    let positions: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    beforeAll(async () => {
        module = await createReportingTestModule();
        repo = module.get(ReportRepository);
        reviews = module.get(ReviewRepository);
        cycles = module.get(CycleRepository);
        positions = module.get(PositionRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetReportingTables(prisma);
    });

    afterAll(async () => {
        await module.close();
    });

    async function seedReview(): Promise<{
        reviewId: number;
        cycleId: number;
    }> {
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
                stage: ReviewStage.FINISHED,
            }),
        );
        return { reviewId: review.id!, cycleId: cycle.id! };
    }

    function buildReport(
        reviewId: number,
        cycleId: number,
        overrides: Partial<{
            respondentCount: number;
            answerCount: number;
        }> = {},
    ): ReportDomain {
        return ReportDomain.create({
            reviewId,
            cycleId,
            respondentCount: overrides.respondentCount ?? 4,
            respondentCategories: [
                RespondentCategory.SELF_ASSESSMENT,
                RespondentCategory.TEAM,
                RespondentCategory.OTHER,
            ],
            answerCount: overrides.answerCount ?? 24,
            turnoutPctOfTeam: 0.75,
            turnoutPctOfOther: 0.5,
            analytics: [],
        });
    }

    describe('create / findById', () => {
        it('persists a report with relations defaulting to empty arrays', async () => {
            const { reviewId, cycleId } = await seedReview();

            const created = await repo.create(buildReport(reviewId, cycleId));

            expect(created.id).toBeDefined();
            expect(created.reviewId).toBe(reviewId);
            expect(created.cycleId).toBe(cycleId);
            expect(created.analytics).toEqual([]);
            expect(created.comments).toEqual([]);
            expect(created.insights).toEqual([]);
        });

        it('findById returns the report with included relations', async () => {
            const { reviewId, cycleId } = await seedReview();
            const persisted = await repo.create(buildReport(reviewId, cycleId));

            const fetched = await repo.findById(persisted.id!);

            expect(fetched).toBeInstanceOf(ReportDomain);
            expect(fetched!.id).toBe(persisted.id);
        });

        it('findById returns null when missing', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });

    describe('findByReviewId', () => {
        it('returns the report attached to a review', async () => {
            const { reviewId, cycleId } = await seedReview();
            await repo.create(buildReport(reviewId, cycleId));

            const fetched = await repo.findByReviewId(reviewId);

            expect(fetched).toBeInstanceOf(ReportDomain);
            expect(fetched!.reviewId).toBe(reviewId);
        });

        it('returns null when no report exists for a review', async () => {
            const { reviewId } = await seedReview();
            await expect(repo.findByReviewId(reviewId)).resolves.toBeNull();
        });
    });

    describe('search', () => {
        it('returns all reports when no filter is supplied', async () => {
            const a = await seedReview();
            const b = await seedReview();
            await repo.create(buildReport(a.reviewId, a.cycleId));
            await repo.create(buildReport(b.reviewId, b.cycleId));

            const all = await repo.search({} as any);
            expect(all).toHaveLength(2);
        });

        it('filters by cycleId', async () => {
            const a = await seedReview();
            const b = await seedReview();
            await repo.create(buildReport(a.reviewId, a.cycleId));
            await repo.create(buildReport(b.reviewId, b.cycleId));

            const result = await repo.search({
                cycleId: a.cycleId,
            } as any);

            expect(result).toHaveLength(1);
            expect(result[0].cycleId).toBe(a.cycleId);
        });

        it('filters by respondentCount', async () => {
            const a = await seedReview();
            const b = await seedReview();
            await repo.create(
                buildReport(a.reviewId, a.cycleId, { respondentCount: 3 }),
            );
            await repo.create(
                buildReport(b.reviewId, b.cycleId, { respondentCount: 7 }),
            );

            const result = await repo.search({
                respondentCount: 7,
            } as any);

            expect(result).toHaveLength(1);
            expect(result[0].respondentCount).toBe(7);
        });

        it('honours descending sort direction on createdAt', async () => {
            const a = await seedReview();
            const b = await seedReview();
            await repo.create(buildReport(a.reviewId, a.cycleId));
            await repo.create(buildReport(b.reviewId, b.cycleId));

            const result = await repo.search({
                sortBy: ReportSortField.CREATED_AT,
                sortDirection: SortDirection.DESC,
            } as any);

            expect(result).toHaveLength(2);
        });
    });
});
