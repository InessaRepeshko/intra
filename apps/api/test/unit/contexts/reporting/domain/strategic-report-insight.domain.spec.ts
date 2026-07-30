import { InsightType } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { StrategicReportInsightDomain } from 'src/contexts/reporting/domain/startegic-report-insight.domain';

describe('StrategicReportInsightDomain', () => {
    const baseProps = {
        strategicReportId: 1,
        insightType: InsightType.HIGHEST_RATING,
        competenceId: 7,
        competenceTitle: 'Teamwork',
    };

    describe('create', () => {
        it('creates an insight with every decimal field coerced', () => {
            const insight = StrategicReportInsightDomain.create({
                id: 100,
                ...baseProps,
                averageScore: '4.5',
                averageRating: 90,
                averageDelta: -5,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(insight.id).toBe(100);
            expect(insight.strategicReportId).toBe(1);
            expect(insight.insightType).toBe(InsightType.HIGHEST_RATING);
            expect(insight.competenceId).toBe(7);
            expect(insight.competenceTitle).toBe('Teamwork');
            expect(insight.averageScore).toBeInstanceOf(Decimal);
            expect(insight.averageScore!.toString()).toBe('4.5');
            expect(insight.averageRating!.toNumber()).toBe(90);
            expect(insight.averageDelta!.toNumber()).toBe(-5);
        });

        it('defaults missing decimal fields to null', () => {
            const insight = StrategicReportInsightDomain.create(baseProps);

            expect(insight.averageScore).toBeNull();
            expect(insight.averageRating).toBeNull();
            expect(insight.averageDelta).toBeNull();
        });
    });
});
