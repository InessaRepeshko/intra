import { EntityType, InsightType } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { ReportInsightDomain } from 'src/contexts/reporting/domain/report-insight.domain';
import { ReportInsightHttpMapper } from 'src/contexts/reporting/presentation/http/mappers/report-insight.http.mapper';

describe('ReportInsightHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field, rounding decimals to 4dp', () => {
            const domain = ReportInsightDomain.create({
                id: 1,
                reportId: 10,
                insightType: InsightType.HIGHEST_RATING,
                entityType: EntityType.QUESTION,
                questionId: 100,
                questionTitle: 'Q?',
                competenceId: null,
                competenceTitle: null,
                averageScore: 4.5,
                averageRating: 90,
                averageDelta: -5,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            const response = ReportInsightHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.reportId).toBe(10);
            expect(response.insightType).toBe(InsightType.HIGHEST_RATING);
            expect(response.entityType).toBe(EntityType.QUESTION);
            expect(response.questionId).toBe(100);
            expect(response.competenceId).toBeNull();
            expect(response.averageScore).toBe(4.5);
            expect(response.averageRating).toBe(90);
            expect(response.averageDelta).toBe(-5);
        });

        it('returns null for missing decimal fields', () => {
            const domain = ReportInsightDomain.create({
                reportId: 10,
                insightType: InsightType.LOWEST_DELTA,
                entityType: EntityType.COMPETENCE,
                questionId: null,
                questionTitle: null,
                competenceId: 7,
                competenceTitle: 'Teamwork',
            });

            const response = ReportInsightHttpMapper.toResponse(domain);

            expect(response.averageScore).toBeNull();
            expect(response.averageRating).toBeNull();
            expect(response.averageDelta).toBeNull();
        });
    });

    describe('roundScore', () => {
        it('rounds a Decimal value to 4 decimal places', () => {
            expect(
                ReportInsightHttpMapper.roundScore(new Decimal('3.456789')),
            ).toBeCloseTo(3.4568, 4);
        });

        it('returns null for null and undefined', () => {
            expect(ReportInsightHttpMapper.roundScore(null)).toBeNull();
            expect(ReportInsightHttpMapper.roundScore(undefined)).toBeNull();
        });
    });
});
