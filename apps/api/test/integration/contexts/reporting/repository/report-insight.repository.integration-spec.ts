import '../../../setup-env';

import {
    EntityType,
    InsightType,
    RespondentCategory,
    ReviewStage,
} from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { ReportInsightDomain } from 'src/contexts/reporting/domain/report-insight.domain';
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';
import { ReportInsightRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report-insight.repository';
import { ReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('ReportInsightRepository (integration)', () => {
    let module: TestingModule;
    let repo: ReportInsightRepository;
    let reports: ReportRepository;
    let reviews: ReviewRepository;
    let cycles: CycleRepository;
    let positions: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let reportId: number;

    beforeAll(async () => {
        module = await createReportingTestModule();
        repo = module.get(ReportInsightRepository);
        reports = module.get(ReportRepository);
        reviews = module.get(ReviewRepository);
        cycles = module.get(CycleRepository);
        positions = module.get(PositionRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetReportingTables(prisma);
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
                stage: ReviewStage.FINISHED,
            }),
        );
        const report = await reports.create(
            ReportDomain.create({
                reviewId: review.id!,
                cycleId: cycle.id!,
                respondentCount: 4,
                respondentCategories: [RespondentCategory.TEAM],
                answerCount: 12,
                analytics: [],
            }),
        );
        reportId = report.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function buildInsight(
        overrides: Partial<{
            insightType: InsightType;
            averageScore: number;
        }> = {},
    ): ReportInsightDomain {
        return ReportInsightDomain.create({
            reportId,
            insightType: overrides.insightType ?? InsightType.HIGHEST_RATING,
            entityType: EntityType.COMPETENCE,
            questionId: null,
            questionTitle: null,
            competenceId: null,
            competenceTitle: 'Teamwork',
            averageScore: overrides.averageScore ?? 4.5,
        });
    }

    describe('createMany', () => {
        it('persists multiple insight rows tied to a report', async () => {
            await repo.createMany(reportId, [
                buildInsight(),
                buildInsight({ insightType: InsightType.LOWEST_RATING }),
            ]);

            const rows = await prisma.reportInsights.findMany({
                where: { reportId },
            });
            expect(rows).toHaveLength(2);
        });

        it('is a no-op for an empty list', async () => {
            await repo.createMany(reportId, []);

            const rows = await prisma.reportInsights.findMany({
                where: { reportId },
            });
            expect(rows).toEqual([]);
        });
    });

    describe('findByReportId', () => {
        it('returns insights in ascending id order', async () => {
            await repo.createMany(reportId, [
                buildInsight({ insightType: InsightType.HIGHEST_RATING }),
                buildInsight({ insightType: InsightType.LOWEST_RATING }),
            ]);

            const result = await repo.findByReportId(reportId);

            expect(result).toHaveLength(2);
            expect(result.map((r) => r.insightType)).toEqual([
                InsightType.HIGHEST_RATING,
                InsightType.LOWEST_RATING,
            ]);
        });

        it('returns an empty array when no insights exist', async () => {
            await expect(repo.findByReportId(reportId)).resolves.toEqual([]);
        });
    });

    describe('findById', () => {
        it('returns the insight when found', async () => {
            await repo.createMany(reportId, [buildInsight()]);
            const stored = await prisma.reportInsights.findFirst({
                where: { reportId },
            });

            await expect(repo.findById(stored!.id)).resolves.toBeInstanceOf(
                ReportInsightDomain,
            );
        });

        it('returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });
});
