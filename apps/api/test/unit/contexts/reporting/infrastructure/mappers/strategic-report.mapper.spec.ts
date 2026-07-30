import {
    StrategicReport as PrismaStrategicReport,
    StrategicReportAnalytics as PrismaStrategicReportAnalytics,
    StrategicReportInsights as PrismaStrategicReportInsights,
} from '@intra/database';
import { StrategicReportDomain } from 'src/contexts/reporting/domain/strategic-report.domain';
import { StrategicReportMapper } from 'src/contexts/reporting/infrastructure/mappers/strategic-report.mapper';

function buildPrismaReport(
    overrides: Partial<PrismaStrategicReport> = {},
): PrismaStrategicReport {
    return {
        id: 1,
        cycleId: 100,
        cycleTitle: 'Q1 2025',
        rateeCount: 3,
        rateeIds: [11, 12, 13],
        respondentCount: 5,
        respondentIds: [20, 21, 22, 23, 24],
        answerCount: 50,
        reviewerCount: 2,
        reviewerIds: [40, 41],
        teamCount: 2,
        teamIds: [1, 2],
        positionCount: 4,
        positionIds: [3, 4, 5, 6],
        competenceCount: 1,
        competenceIds: [100],
        questionCount: 2,
        questionIds: [200, 201],
        turnoutAvgPctOfRatees: '100.0000',
        turnoutAvgPctOfTeams: '90.5000',
        turnoutAvgPctOfOthers: '88.0000',
        competenceGeneralAvgSelf: '4.0000',
        competenceGeneralAvgTeam: '3.5000',
        competenceGeneralAvgOther: '3.9000',
        competenceGeneralPctSelf: '80.0000',
        competenceGeneralPctTeam: '70.0000',
        competenceGeneralPctOther: '78.0000',
        competenceGeneralDeltaTeam: '-10.0000',
        competenceGeneralDeltaOther: '-2.0000',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        ...overrides,
    } as unknown as PrismaStrategicReport;
}

describe('StrategicReportMapper', () => {
    describe('toDomain', () => {
        it('converts a prisma row into a StrategicReportDomain with empty relations', () => {
            const domain = StrategicReportMapper.toDomain(buildPrismaReport());

            expect(domain).toBeInstanceOf(StrategicReportDomain);
            expect(domain.id).toBe(1);
            expect(domain.cycleId).toBe(100);
            expect(domain.cycleTitle).toBe('Q1 2025');
            expect(domain.rateeIds).toEqual([11, 12, 13]);
            expect(domain.competenceGeneralAvgSelf!.toNumber()).toBe(4);
            expect(domain.analytics).toEqual([]);
            expect(domain.insights).toEqual([]);
        });
    });

    describe('toDomainWithRelations', () => {
        it('includes analytics and insights in the aggregate', () => {
            const prismaAnalytic = {
                id: 1,
                strategicReportId: 1,
                competenceId: 7,
                competenceTitle: 'Teamwork',
                averageBySelfAssessment: '4.0000',
                averageByTeam: '3.5000',
                averageByOther: '3.9000',
                percentageBySelfAssessment: '80.0000',
                percentageByTeam: '70.0000',
                percentageByOther: '78.0000',
                deltaPercentageByTeam: '-10.0000',
                deltaPercentageByOther: '-2.0000',
                createdAt: new Date(),
            } as unknown as PrismaStrategicReportAnalytics;

            const prismaInsight = {
                id: 1,
                strategicReportId: 1,
                insightType: 'HIGHEST_RATING',
                competenceId: 7,
                competenceTitle: 'Teamwork',
                averageScore: '4.5000',
                averageRating: '90.0000',
                averageDelta: '-5.0000',
                createdAt: new Date(),
            } as unknown as PrismaStrategicReportInsights;

            const domain = StrategicReportMapper.toDomainWithRelations({
                ...buildPrismaReport(),
                analytics: [prismaAnalytic],
                insights: [prismaInsight],
            });

            expect(domain.analytics).toHaveLength(1);
            expect(domain.analytics![0].competenceTitle).toBe('Teamwork');
            expect(domain.insights).toHaveLength(1);
            expect(domain.insights![0].averageRating!.toNumber()).toBe(90);
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain object into a Prisma create input', () => {
            const domain = StrategicReportDomain.create({
                cycleId: 100,
                cycleTitle: 'Q1',
                rateeCount: 1,
                rateeIds: [1],
                respondentCount: 0,
                respondentIds: [],
                answerCount: 0,
                reviewerCount: 0,
                reviewerIds: [],
                teamCount: 0,
                teamIds: [],
                positionCount: 0,
                positionIds: [],
                competenceCount: 0,
                competenceIds: [],
                questionCount: 0,
                questionIds: [],
                turnoutAvgPctOfRatees: 100,
                competenceGeneralAvgSelf: 4,
            });

            const prisma = StrategicReportMapper.toPrisma(domain);

            expect(prisma.cycleId).toBe(100);
            expect(prisma.cycleTitle).toBe('Q1');
            expect(prisma.rateeIds).toEqual([1]);
            expect(prisma.turnoutAvgPctOfRatees).toBe('100.0000');
            expect(prisma.competenceGeneralAvgSelf).toBe('4.0000');
            expect(prisma.turnoutAvgPctOfTeams).toBeUndefined();
        });
    });
});
