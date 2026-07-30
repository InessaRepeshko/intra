import '../../../setup-env';

import { InsightType } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { StrategicReportInsightDomain } from 'src/contexts/reporting/domain/startegic-report-insight.domain';
import { StrategicReportDomain } from 'src/contexts/reporting/domain/strategic-report.domain';
import { StrategicReportInsightRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/startegic-report-insight.repository';
import { StrategicReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/strategic-report.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('StrategicReportInsightRepository (integration)', () => {
    let module: TestingModule;
    let repo: StrategicReportInsightRepository;
    let strategicReports: StrategicReportRepository;
    let cycles: CycleRepository;
    let competences: CompetenceRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    let strategicReportId: number;
    let competenceId: number;

    beforeAll(async () => {
        module = await createReportingTestModule();
        repo = module.get(StrategicReportInsightRepository);
        strategicReports = module.get(StrategicReportRepository);
        cycles = module.get(CycleRepository);
        competences = module.get(CompetenceRepository);
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
        const cycle = await cycles.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hr.id!,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );
        const competence = await competences.create(
            CompetenceDomain.create({ title: 'Teamwork' }),
        );
        const strategicReport = await strategicReports.create(
            StrategicReportDomain.create({
                cycleId: cycle.id!,
                cycleTitle: 'Cycle',
                rateeCount: 5,
                rateeIds: [],
                respondentCount: 12,
                respondentIds: [],
                answerCount: 100,
                reviewerCount: 5,
                reviewerIds: [],
                teamCount: 2,
                teamIds: [],
                positionCount: 3,
                positionIds: [],
                competenceCount: 1,
                competenceIds: [competence.id!],
                questionCount: 0,
                questionIds: [],
            }),
        );

        strategicReportId = strategicReport.id!;
        competenceId = competence.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function buildInsight(
        overrides: Partial<{
            insightType: InsightType;
            averageScore: number;
        }> = {},
    ): StrategicReportInsightDomain {
        return StrategicReportInsightDomain.create({
            strategicReportId,
            insightType: overrides.insightType ?? InsightType.HIGHEST_RATING,
            competenceId,
            competenceTitle: 'Teamwork',
            averageScore: overrides.averageScore ?? 4.7,
        });
    }

    describe('createMany', () => {
        it('persists multiple insight rows', async () => {
            await repo.createMany(strategicReportId, [
                buildInsight(),
                buildInsight({ insightType: InsightType.LOWEST_RATING }),
            ]);

            const rows = await prisma.strategicReportInsights.findMany({
                where: { strategicReportId },
            });
            expect(rows).toHaveLength(2);
        });

        it('is a no-op for an empty list', async () => {
            await repo.createMany(strategicReportId, []);

            const rows = await prisma.strategicReportInsights.findMany({
                where: { strategicReportId },
            });
            expect(rows).toEqual([]);
        });
    });

    describe('findByStrategicReportId', () => {
        it('returns insights in ascending id order', async () => {
            await repo.createMany(strategicReportId, [
                buildInsight({ insightType: InsightType.HIGHEST_RATING }),
                buildInsight({ insightType: InsightType.LOWEST_RATING }),
            ]);

            const result =
                await repo.findByStrategicReportId(strategicReportId);

            expect(result.map((r) => r.insightType)).toEqual([
                InsightType.HIGHEST_RATING,
                InsightType.LOWEST_RATING,
            ]);
        });

        it('returns an empty array when no insights exist', async () => {
            await expect(
                repo.findByStrategicReportId(strategicReportId),
            ).resolves.toEqual([]);
        });
    });

    describe('findById', () => {
        it('returns the insight when found', async () => {
            await repo.createMany(strategicReportId, [buildInsight()]);
            const stored = await prisma.strategicReportInsights.findFirst({
                where: { strategicReportId },
            });

            await expect(repo.findById(stored!.id)).resolves.toBeInstanceOf(
                StrategicReportInsightDomain,
            );
        });

        it('returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });
});
