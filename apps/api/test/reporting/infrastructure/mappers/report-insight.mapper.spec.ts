import { ReportInsights as PrismaReportInsights } from '@intra/database';
import { EntityType, InsightType } from '@intra/shared-kernel';
import { ReportInsightDomain } from 'src/contexts/reporting/domain/report-insight.domain';
import { ReportInsightMapper } from 'src/contexts/reporting/infrastructure/mappers/report-insight.mapper';

describe('ReportInsightMapper', () => {
    const prismaRow = {
        id: 1,
        reportId: 10,
        insightType: 'HIGHEST_RATING' as PrismaReportInsights['insightType'],
        entityType: 'QUESTION' as PrismaReportInsights['entityType'],
        questionId: 100,
        questionTitle: 'Q?',
        competenceId: null,
        competenceTitle: null,
        averageScore: '4.5000',
        averageRating: '90.0000',
        averageDelta: '-5.0000',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as unknown as PrismaReportInsights;

    describe('toDomain', () => {
        it('converts a prisma row into a ReportInsightDomain', () => {
            const domain = ReportInsightMapper.toDomain(prismaRow);

            expect(domain).toBeInstanceOf(ReportInsightDomain);
            expect(domain.id).toBe(1);
            expect(domain.reportId).toBe(10);
            expect(domain.insightType).toBe(InsightType.HIGHEST_RATING);
            expect(domain.entityType).toBe(EntityType.QUESTION);
            expect(domain.questionId).toBe(100);
            expect(domain.averageScore!.toNumber()).toBe(4.5);
            expect(domain.averageRating!.toNumber()).toBe(90);
            expect(domain.averageDelta!.toNumber()).toBe(-5);
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain object into a Prisma create input', () => {
            const domain = ReportInsightDomain.create({
                reportId: 10,
                insightType: InsightType.LOWEST_DELTA,
                entityType: EntityType.COMPETENCE,
                questionId: null,
                questionTitle: null,
                competenceId: 7,
                competenceTitle: 'Teamwork',
                averageScore: 4,
                averageRating: 80,
                averageDelta: -10,
            });

            const prisma = ReportInsightMapper.toPrisma(99, domain);

            expect(prisma.reportId).toBe(99);
            expect(prisma.insightType).toBe('LOWEST_DELTA');
            expect(prisma.entityType).toBe('COMPETENCE');
            expect(prisma.questionId).toBeUndefined();
            expect(prisma.competenceId).toBe(7);
            expect(prisma.averageScore).toBe('4.0000');
            expect(prisma.averageRating).toBe('80.0000');
            expect(prisma.averageDelta).toBe('-10.0000');
        });
    });

    describe('enum conversions', () => {
        it('uppercases the entity type in both directions', () => {
            expect(
                ReportInsightMapper.toPrismaEntityType(EntityType.QUESTION),
            ).toBe('QUESTION');
            expect(
                ReportInsightMapper.toDomainEntityType(
                    'COMPETENCE' as PrismaReportInsights['entityType'],
                ),
            ).toBe(EntityType.COMPETENCE);
        });

        it('uppercases the insight type in both directions', () => {
            expect(
                ReportInsightMapper.toPrismaInsightType(
                    InsightType.HIGHEST_DELTA,
                ),
            ).toBe('HIGHEST_DELTA');
            expect(
                ReportInsightMapper.toDomainInsightType(
                    'LOWEST_RATING' as PrismaReportInsights['insightType'],
                ),
            ).toBe(InsightType.LOWEST_RATING);
        });
    });

    describe('toDecimalString', () => {
        it('returns undefined for null/undefined inputs', () => {
            expect(ReportInsightMapper.toDecimalString(null)).toBeUndefined();
            expect(
                ReportInsightMapper.toDecimalString(undefined),
            ).toBeUndefined();
        });

        it('rounds to 4 decimal places', () => {
            expect(ReportInsightMapper.toDecimalString(3.45678)).toBe('3.4568');
        });
    });
});
