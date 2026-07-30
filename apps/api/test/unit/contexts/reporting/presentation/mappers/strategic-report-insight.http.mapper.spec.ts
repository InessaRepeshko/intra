import { InsightType } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { StrategicReportInsightDomain } from 'src/contexts/reporting/domain/startegic-report-insight.domain';
import { StrategicReportInsightHttpMapper } from 'src/contexts/reporting/presentation/http/mappers/startegic-report-insight.http.mapper';

describe('StrategicReportInsightHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field, rounding decimals to 4dp', () => {
            const domain = StrategicReportInsightDomain.create({
                id: 1,
                strategicReportId: 10,
                insightType: InsightType.HIGHEST_RATING,
                competenceId: 7,
                competenceTitle: 'Teamwork',
                averageScore: 4.5,
                averageRating: 90,
                averageDelta: -5,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            const response =
                StrategicReportInsightHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.strategicReportId).toBe(10);
            expect(response.insightType).toBe(InsightType.HIGHEST_RATING);
            expect(response.competenceId).toBe(7);
            expect(response.competenceTitle).toBe('Teamwork');
            expect(response.averageScore).toBe(4.5);
            expect(response.averageRating).toBe(90);
            expect(response.averageDelta).toBe(-5);
        });

        it('returns null for missing decimal fields', () => {
            const domain = StrategicReportInsightDomain.create({
                strategicReportId: 10,
                insightType: InsightType.LOWEST_DELTA,
                competenceId: 7,
                competenceTitle: 'Teamwork',
            });

            const response =
                StrategicReportInsightHttpMapper.toResponse(domain);

            expect(response.averageScore).toBeNull();
            expect(response.averageRating).toBeNull();
            expect(response.averageDelta).toBeNull();
        });
    });

    describe('roundScore', () => {
        it('rounds a Decimal value to 4 decimal places', () => {
            expect(
                StrategicReportInsightHttpMapper.roundScore(
                    new Decimal('3.456789'),
                ),
            ).toBeCloseTo(3.4568, 4);
        });

        it('returns null for null and undefined', () => {
            expect(
                StrategicReportInsightHttpMapper.roundScore(null),
            ).toBeNull();
            expect(
                StrategicReportInsightHttpMapper.roundScore(undefined),
            ).toBeNull();
        });
    });
});
