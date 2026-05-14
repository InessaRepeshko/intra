import Decimal from 'decimal.js';
import { StrategicReportAnalyticsDomain } from 'src/contexts/reporting/domain/strategic-report-analytics.domain';

describe('StrategicReportAnalyticsDomain', () => {
    const baseProps = {
        strategicReportId: 1,
        competenceId: 7,
        competenceTitle: 'Teamwork',
    };

    describe('create', () => {
        it('creates analytics with every decimal field coerced', () => {
            const analytics = StrategicReportAnalyticsDomain.create({
                id: 100,
                ...baseProps,
                averageBySelfAssessment: 4,
                averageByTeam: 3.5,
                averageByOther: '3.9',
                percentageBySelfAssessment: 80,
                percentageByTeam: 70,
                percentageByOther: 78,
                deltaPercentageByTeam: -10,
                deltaPercentageByOther: -2,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(analytics.id).toBe(100);
            expect(analytics.strategicReportId).toBe(1);
            expect(analytics.competenceId).toBe(7);
            expect(analytics.competenceTitle).toBe('Teamwork');
            expect(analytics.averageByOther).toBeInstanceOf(Decimal);
            expect(analytics.averageByOther!.toString()).toBe('3.9');
            expect(analytics.deltaPercentageByTeam!.toNumber()).toBe(-10);
            expect(analytics.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('defaults missing decimal fields to null', () => {
            const analytics = StrategicReportAnalyticsDomain.create(baseProps);

            expect(analytics.averageBySelfAssessment).toBeNull();
            expect(analytics.averageByTeam).toBeNull();
            expect(analytics.averageByOther).toBeNull();
            expect(analytics.percentageBySelfAssessment).toBeNull();
            expect(analytics.deltaPercentageByTeam).toBeNull();
            expect(analytics.deltaPercentageByOther).toBeNull();
        });
    });
});
