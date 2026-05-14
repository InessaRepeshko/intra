import { StrategicReportInsights as PrismaStrategicReportInsights } from '@intra/database';
import { EntityType, InsightType } from '@intra/shared-kernel';
import { StrategicReportInsightDomain } from 'src/contexts/reporting/domain/startegic-report-insight.domain';
import { StrategicReportInsightMapper } from 'src/contexts/reporting/infrastructure/mappers/strategic-report-insight.mapper';

describe('StrategicReportInsightMapper', () => {
    const prismaRow = {
        id: 1,
        strategicReportId: 10,
        insightType:
            'HIGHEST_RATING' as PrismaStrategicReportInsights['insightType'],
        competenceId: 7,
        competenceTitle: 'Teamwork',
        averageScore: '4.5000',
        averageRating: '90.0000',
        averageDelta: '-5.0000',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as unknown as PrismaStrategicReportInsights;

    describe('toDomain', () => {
        it('converts a prisma row into a StrategicReportInsightDomain', () => {
            const domain = StrategicReportInsightMapper.toDomain(prismaRow);

            expect(domain).toBeInstanceOf(StrategicReportInsightDomain);
            expect(domain.id).toBe(1);
            expect(domain.strategicReportId).toBe(10);
            expect(domain.insightType).toBe(InsightType.HIGHEST_RATING);
            expect(domain.competenceId).toBe(7);
            expect(domain.averageScore!.toNumber()).toBe(4.5);
            expect(domain.averageRating!.toNumber()).toBe(90);
            expect(domain.averageDelta!.toNumber()).toBe(-5);
        });
    });

    describe('toPrisma', () => {
        it('serialises with 4dp strings and undefined for null fields', () => {
            const domain = StrategicReportInsightDomain.create({
                strategicReportId: 0,
                insightType: InsightType.LOWEST_DELTA,
                competenceId: 7,
                competenceTitle: 'Teamwork',
                averageScore: 4.5,
            });

            const prisma = StrategicReportInsightMapper.toPrisma(99, domain);

            expect(prisma.strategicReportId).toBe(99);
            expect(prisma.insightType).toBe('LOWEST_DELTA');
            expect(prisma.competenceId).toBe(7);
            expect(prisma.averageScore).toBe('4.5000');
            expect(prisma.averageRating).toBeUndefined();
        });
    });

    describe('enum conversions', () => {
        it('uppercases entity type in both directions', () => {
            expect(
                StrategicReportInsightMapper.toPrismaEntityType(
                    EntityType.COMPETENCE,
                ),
            ).toBe('COMPETENCE');
            expect(
                StrategicReportInsightMapper.toDomainEntityType(
                    'QUESTION' as any,
                ),
            ).toBe(EntityType.QUESTION);
        });

        it('uppercases insight type in both directions', () => {
            expect(
                StrategicReportInsightMapper.toPrismaInsightType(
                    InsightType.LOWEST_RATING,
                ),
            ).toBe('LOWEST_RATING');
            expect(
                StrategicReportInsightMapper.toDomainInsightType(
                    'HIGHEST_DELTA' as PrismaStrategicReportInsights['insightType'],
                ),
            ).toBe(InsightType.HIGHEST_DELTA);
        });
    });
});
