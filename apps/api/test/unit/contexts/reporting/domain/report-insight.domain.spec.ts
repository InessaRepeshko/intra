import { EntityType, InsightType } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { ReportInsightDomain } from 'src/contexts/reporting/domain/report-insight.domain';

describe('ReportInsightDomain', () => {
    const baseProps = {
        reportId: 1,
        insightType: InsightType.HIGHEST_RATING,
        entityType: EntityType.QUESTION,
        questionId: 10,
        questionTitle: 'Q?',
        competenceId: null,
        competenceTitle: null,
    };

    describe('create', () => {
        it('creates a question insight with all decimal fields coerced', () => {
            const insight = ReportInsightDomain.create({
                id: 5,
                ...baseProps,
                averageScore: '4.5',
                averageRating: 90,
                averageDelta: -5,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(insight.id).toBe(5);
            expect(insight.insightType).toBe(InsightType.HIGHEST_RATING);
            expect(insight.entityType).toBe(EntityType.QUESTION);
            expect(insight.questionId).toBe(10);
            expect(insight.averageScore).toBeInstanceOf(Decimal);
            expect(insight.averageScore!.toString()).toBe('4.5');
            expect(insight.averageRating!.toNumber()).toBe(90);
            expect(insight.averageDelta!.toNumber()).toBe(-5);
        });

        it('defaults missing decimal/optional fields to null', () => {
            const insight = ReportInsightDomain.create(baseProps);

            expect(insight.averageScore).toBeNull();
            expect(insight.averageRating).toBeNull();
            expect(insight.averageDelta).toBeNull();
        });

        it('normalises competence fields to null for question insights', () => {
            const insight = ReportInsightDomain.create({
                ...baseProps,
                competenceId: null,
                competenceTitle: null,
            });
            expect(insight.competenceId).toBeNull();
            expect(insight.competenceTitle).toBeNull();
        });
    });
});
