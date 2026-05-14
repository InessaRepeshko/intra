import { ReportAnalytics as PrismaReportAnalytics } from '@intra/database';
import { EntityType } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { ReportAnalyticsDomain } from 'src/contexts/reporting/domain/report-analytics.domain';
import { ReportAnalyticsMapper } from 'src/contexts/reporting/infrastructure/mappers/report-analytics.mapper';

describe('ReportAnalyticsMapper', () => {
    const prismaRow = {
        id: 1,
        reportId: 10,
        entityType: 'QUESTION' as PrismaReportAnalytics['entityType'],
        questionId: 100,
        questionTitle: 'Q?',
        competenceId: null,
        competenceTitle: null,
        averageBySelfAssessment: '4.0000',
        averageByTeam: '3.5000',
        averageByOther: '4.2500',
        percentageBySelfAssessment: '80.0000',
        percentageByTeam: '70.0000',
        percentageByOther: '85.0000',
        deltaPercentageByTeam: '-10.0000',
        deltaPercentageByOther: '5.0000',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as unknown as PrismaReportAnalytics;

    describe('toDomain', () => {
        it('converts a prisma row into a ReportAnalyticsDomain', () => {
            const domain = ReportAnalyticsMapper.toDomain(prismaRow);

            expect(domain).toBeInstanceOf(ReportAnalyticsDomain);
            expect(domain.id).toBe(1);
            expect(domain.reportId).toBe(10);
            expect(domain.entityType).toBe(EntityType.QUESTION);
            expect(domain.questionId).toBe(100);
            expect(domain.averageByTeam!.toNumber()).toBe(3.5);
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain object into a Prisma create input with 4dp strings', () => {
            const domain = ReportAnalyticsDomain.create({
                reportId: 10,
                entityType: EntityType.COMPETENCE,
                questionId: null,
                questionTitle: null,
                competenceId: 7,
                competenceTitle: 'Teamwork',
                averageBySelfAssessment: 4,
                averageByTeam: 3.456789,
                averageByOther: 3.9,
                percentageBySelfAssessment: 80,
                percentageByTeam: 69.5,
                percentageByOther: 78,
                deltaPercentageByTeam: null,
                deltaPercentageByOther: null,
            });

            const prisma = ReportAnalyticsMapper.toPrisma(99, domain);

            expect(prisma.reportId).toBe(99);
            expect(prisma.entityType).toBe('COMPETENCE');
            expect(prisma.questionId).toBeUndefined();
            expect(prisma.competenceId).toBe(7);
            expect(prisma.averageByTeam).toBe('3.4568');
            expect(prisma.deltaPercentageByTeam).toBeUndefined();
        });
    });

    describe('entity-type conversions', () => {
        it('uppercases the entity type in both directions', () => {
            expect(
                ReportAnalyticsMapper.toPrismaEntityType(EntityType.QUESTION),
            ).toBe('QUESTION');
            expect(
                ReportAnalyticsMapper.toDomainEntityType(
                    'COMPETENCE' as PrismaReportAnalytics['entityType'],
                ),
            ).toBe(EntityType.COMPETENCE);
        });
    });

    describe('toDecimalString', () => {
        it('returns undefined for null/undefined inputs', () => {
            expect(ReportAnalyticsMapper.toDecimalString(null)).toBeUndefined();
            expect(
                ReportAnalyticsMapper.toDecimalString(undefined),
            ).toBeUndefined();
        });

        it('rounds to exactly 4 decimal places', () => {
            expect(ReportAnalyticsMapper.toDecimalString(3.45678)).toBe('3.4568');
            expect(ReportAnalyticsMapper.toDecimalString(new Decimal(2))).toBe(
                '2.0000',
            );
        });
    });
});
