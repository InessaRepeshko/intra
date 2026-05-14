import { StrategicReportAnalytics as PrismaStrategicReportAnalytics } from '@intra/database';
import { StrategicReportAnalyticsDomain } from 'src/contexts/reporting/domain/strategic-report-analytics.domain';
import { StrategicReportAnalyticsMapper } from 'src/contexts/reporting/infrastructure/mappers/strategic-report-analytics.mapper';

describe('StrategicReportAnalyticsMapper', () => {
    const prismaRow = {
        id: 1,
        strategicReportId: 10,
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
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as unknown as PrismaStrategicReportAnalytics;

    describe('toDomain', () => {
        it('converts a prisma row into a StrategicReportAnalyticsDomain', () => {
            const domain = StrategicReportAnalyticsMapper.toDomain(prismaRow);

            expect(domain).toBeInstanceOf(StrategicReportAnalyticsDomain);
            expect(domain.id).toBe(1);
            expect(domain.strategicReportId).toBe(10);
            expect(domain.competenceId).toBe(7);
            expect(domain.competenceTitle).toBe('Teamwork');
            expect(domain.averageByTeam!.toNumber()).toBe(3.5);
        });
    });

    describe('toPrisma', () => {
        it('serialises with 4dp strings and undefined for null fields', () => {
            const domain = StrategicReportAnalyticsDomain.create({
                strategicReportId: 0,
                competenceId: 7,
                competenceTitle: 'Teamwork',
                averageBySelfAssessment: 4,
                averageByTeam: 3.45678,
            });

            const prisma = StrategicReportAnalyticsMapper.toPrisma(99, domain);

            expect(prisma.strategicReportId).toBe(99);
            expect(prisma.competenceId).toBe(7);
            expect(prisma.competenceTitle).toBe('Teamwork');
            expect(prisma.averageBySelfAssessment).toBe('4.0000');
            expect(prisma.averageByTeam).toBe('3.4568');
            expect(prisma.averageByOther).toBeUndefined();
        });
    });

    describe('toDecimalString', () => {
        it('returns undefined for null/undefined', () => {
            expect(
                StrategicReportAnalyticsMapper.toDecimalString(null),
            ).toBeUndefined();
            expect(
                StrategicReportAnalyticsMapper.toDecimalString(undefined),
            ).toBeUndefined();
        });

        it('rounds to 4 decimal places', () => {
            expect(
                StrategicReportAnalyticsMapper.toDecimalString(3.45678),
            ).toBe('3.4568');
        });
    });
});
