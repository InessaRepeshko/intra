import '../../../setup-env';

import {
    EntityType,
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
import { ReportAnalyticsDomain } from 'src/contexts/reporting/domain/report-analytics.domain';
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';
import { ReportAnalyticsRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report-analytics.repository';
import { ReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('ReportAnalyticsRepository (integration)', () => {
    let module: TestingModule;
    let repo: ReportAnalyticsRepository;
    let reports: ReportRepository;
    let reviews: ReviewRepository;
    let cycles: CycleRepository;
    let positions: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let reportId: number;

    beforeAll(async () => {
        module = await createReportingTestModule();
        repo = module.get(ReportAnalyticsRepository);
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
                respondentCategories: [
                    RespondentCategory.TEAM,
                    RespondentCategory.OTHER,
                ],
                answerCount: 12,
                analytics: [],
            }),
        );
        reportId = report.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function buildAnalytics(
        overrides: Partial<{
            entityType: EntityType;
            questionId: number | null;
            competenceId: number | null;
        }> = {},
    ): ReportAnalyticsDomain {
        return ReportAnalyticsDomain.create({
            reportId,
            entityType: overrides.entityType ?? EntityType.COMPETENCE,
            questionId: overrides.questionId ?? null,
            questionTitle: null,
            competenceId: overrides.competenceId ?? null,
            competenceTitle: 'Teamwork',
            averageBySelfAssessment: 4.5,
            averageByTeam: 3.8,
            averageByOther: 4.0,
        });
    }

    describe('createMany', () => {
        it('persists multiple analytics rows tied to a report', async () => {
            await repo.createMany(reportId, [
                buildAnalytics(),
                buildAnalytics({ entityType: EntityType.QUESTION }),
            ]);

            const rows = await prisma.reportAnalytics.findMany({
                where: { reportId },
            });
            expect(rows).toHaveLength(2);
        });

        it('is a no-op for an empty list', async () => {
            await repo.createMany(reportId, []);

            const rows = await prisma.reportAnalytics.findMany({
                where: { reportId },
            });
            expect(rows).toEqual([]);
        });
    });

    describe('findByReportId', () => {
        it('returns analytics in ascending id order', async () => {
            await repo.createMany(reportId, [
                buildAnalytics({ entityType: EntityType.COMPETENCE }),
                buildAnalytics({ entityType: EntityType.QUESTION }),
            ]);

            const result = await repo.findByReportId(reportId);

            expect(result).toHaveLength(2);
            expect(result.map((r) => r.entityType)).toEqual([
                EntityType.COMPETENCE,
                EntityType.QUESTION,
            ]);
        });

        it('returns an empty array when no analytics exist', async () => {
            await expect(repo.findByReportId(reportId)).resolves.toEqual([]);
        });
    });

    describe('findById', () => {
        it('returns the analytics row when found', async () => {
            await repo.createMany(reportId, [buildAnalytics()]);
            const stored = await prisma.reportAnalytics.findFirst({
                where: { reportId },
            });

            await expect(repo.findById(stored!.id)).resolves.toBeInstanceOf(
                ReportAnalyticsDomain,
            );
        });

        it('returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });
});
