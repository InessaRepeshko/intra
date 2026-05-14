import '../../../setup-env';

import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { StrategicReportAnalyticsDomain } from 'src/contexts/reporting/domain/strategic-report-analytics.domain';
import { StrategicReportDomain } from 'src/contexts/reporting/domain/strategic-report.domain';
import { StrategicReportAnalyticsRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/strategic-report-analytics.repository';
import { StrategicReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/strategic-report.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('StrategicReportAnalyticsRepository (integration)', () => {
    let module: TestingModule;
    let repo: StrategicReportAnalyticsRepository;
    let strategicReports: StrategicReportRepository;
    let cycles: CycleRepository;
    let competences: CompetenceRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    let strategicReportId: number;
    let competenceId: number;

    beforeAll(async () => {
        module = await createReportingTestModule();
        repo = module.get(StrategicReportAnalyticsRepository);
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

    function buildAnalytics(
        overrides: Partial<{ averageByTeam: number }> = {},
    ): StrategicReportAnalyticsDomain {
        return StrategicReportAnalyticsDomain.create({
            strategicReportId,
            competenceId,
            competenceTitle: 'Teamwork',
            averageBySelfAssessment: 4.5,
            averageByTeam: overrides.averageByTeam ?? 3.8,
            averageByOther: 4.1,
        });
    }

    describe('createMany', () => {
        it('persists multiple analytics rows', async () => {
            await repo.createMany(strategicReportId, [
                buildAnalytics(),
                buildAnalytics({ averageByTeam: 4.0 }),
            ]);

            const rows = await prisma.strategicReportAnalytics.findMany({
                where: { strategicReportId },
            });
            expect(rows).toHaveLength(2);
        });

        it('is a no-op for an empty list', async () => {
            await repo.createMany(strategicReportId, []);

            const rows = await prisma.strategicReportAnalytics.findMany({
                where: { strategicReportId },
            });
            expect(rows).toEqual([]);
        });
    });

    describe('findByStrategicReportId', () => {
        it('returns analytics in ascending id order', async () => {
            await repo.createMany(strategicReportId, [
                buildAnalytics(),
                buildAnalytics({ averageByTeam: 4.0 }),
            ]);

            const result =
                await repo.findByStrategicReportId(strategicReportId);

            expect(result).toHaveLength(2);
            expect(result[0].averageByTeam!.toNumber()).toBe(3.8);
            expect(result[1].averageByTeam!.toNumber()).toBe(4.0);
        });

        it('returns an empty array when no analytics exist', async () => {
            await expect(
                repo.findByStrategicReportId(strategicReportId),
            ).resolves.toEqual([]);
        });
    });

    describe('findById', () => {
        it('returns the analytics row when found', async () => {
            await repo.createMany(strategicReportId, [buildAnalytics()]);
            const stored = await prisma.strategicReportAnalytics.findFirst({
                where: { strategicReportId },
            });

            await expect(repo.findById(stored!.id)).resolves.toBeInstanceOf(
                StrategicReportAnalyticsDomain,
            );
        });

        it('returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });
});
