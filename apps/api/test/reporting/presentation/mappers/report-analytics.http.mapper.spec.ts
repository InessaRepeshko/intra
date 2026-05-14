import { EntityType } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { ReportAnalyticsDomain } from 'src/contexts/reporting/domain/report-analytics.domain';
import { ReportAnalyticsHttpMapper } from 'src/contexts/reporting/presentation/http/mappers/report-analytics.http.mapper';

describe('ReportAnalyticsHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field, rounding decimals to 4dp', () => {
            const domain = ReportAnalyticsDomain.create({
                id: 1,
                reportId: 10,
                entityType: EntityType.QUESTION,
                questionId: 100,
                questionTitle: 'Q?',
                competenceId: null,
                competenceTitle: null,
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

            const response = ReportAnalyticsHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.reportId).toBe(10);
            expect(response.entityType).toBe(EntityType.QUESTION);
            expect(response.questionId).toBe(100);
            expect(response.competenceId).toBeNull();
            expect(response.averageByTeam).toBeCloseTo(3.4568, 4);
            expect(response.percentageBySelfAssessment).toBe(80);
            expect(response.deltaPercentageByTeam).toBe(-10);
            expect(response.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('returns null for missing decimal fields', () => {
            const domain = ReportAnalyticsDomain.create({
                reportId: 10,
                entityType: EntityType.COMPETENCE,
                questionId: null,
                questionTitle: null,
                competenceId: 7,
                competenceTitle: 'Teamwork',
            });

            const response = ReportAnalyticsHttpMapper.toResponse(domain);

            expect(response.averageBySelfAssessment).toBeNull();
            expect(response.averageByTeam).toBeNull();
            expect(response.deltaPercentageByOther).toBeNull();
        });
    });

    describe('roundScore', () => {
        it('rounds a Decimal value to 4 decimal places', () => {
            expect(
                ReportAnalyticsHttpMapper.roundScore(new Decimal('3.456789')),
            ).toBeCloseTo(3.4568, 4);
        });

        it('accepts a plain number', () => {
            expect(ReportAnalyticsHttpMapper.roundScore(2.5)).toBe(2.5);
        });

        it('returns null for null or undefined', () => {
            expect(ReportAnalyticsHttpMapper.roundScore(null)).toBeNull();
            expect(
                ReportAnalyticsHttpMapper.roundScore(undefined),
            ).toBeNull();
        });
    });
});
