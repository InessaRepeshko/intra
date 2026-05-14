import Decimal from 'decimal.js';
import { StrategicReportAnalyticsDomain } from 'src/contexts/reporting/domain/strategic-report-analytics.domain';
import { StrategicReportAnalyticsHttpMapper } from 'src/contexts/reporting/presentation/http/mappers/strategic-report-analytics.http.mapper';

describe('StrategicReportAnalyticsHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field, rounding decimals to 4dp', () => {
            const domain = StrategicReportAnalyticsDomain.create({
                id: 1,
                strategicReportId: 10,
                competenceId: 7,
                competenceTitle: 'Teamwork',
                averageBySelfAssessment: 4,
                averageByTeam: 3.456789,
                averageByOther: 3.9,
                percentageBySelfAssessment: 80,
                percentageByTeam: 69.5,
                percentageByOther: 78,
                deltaPercentageByTeam: -10,
                deltaPercentageByOther: -2,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            const response =
                StrategicReportAnalyticsHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.strategicReportId).toBe(10);
            expect(response.competenceId).toBe(7);
            expect(response.competenceTitle).toBe('Teamwork');
            expect(response.averageByTeam).toBeCloseTo(3.4568, 4);
            expect(response.percentageBySelfAssessment).toBe(80);
            expect(response.deltaPercentageByTeam).toBe(-10);
            expect(response.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('returns null for missing decimal fields', () => {
            const domain = StrategicReportAnalyticsDomain.create({
                strategicReportId: 10,
                competenceId: 7,
                competenceTitle: 'Teamwork',
            });

            const response =
                StrategicReportAnalyticsHttpMapper.toResponse(domain);

            expect(response.averageBySelfAssessment).toBeNull();
            expect(response.deltaPercentageByOther).toBeNull();
        });
    });

    describe('roundScore', () => {
        it('rounds a Decimal value to 4 decimal places', () => {
            expect(
                StrategicReportAnalyticsHttpMapper.roundScore(
                    new Decimal('3.456789'),
                ),
            ).toBeCloseTo(3.4568, 4);
        });

        it('returns null for null and undefined', () => {
            expect(
                StrategicReportAnalyticsHttpMapper.roundScore(null),
            ).toBeNull();
            expect(
                StrategicReportAnalyticsHttpMapper.roundScore(undefined),
            ).toBeNull();
        });
    });
});
