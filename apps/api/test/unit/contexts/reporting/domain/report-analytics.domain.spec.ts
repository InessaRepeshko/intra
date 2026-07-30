import { EntityType } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { ReportAnalyticsDomain } from 'src/contexts/reporting/domain/report-analytics.domain';

describe('ReportAnalyticsDomain', () => {
    const baseProps = {
        reportId: 1,
        entityType: EntityType.QUESTION,
        questionId: 10,
        questionTitle: 'How effective?',
        competenceId: null,
        competenceTitle: null,
    };

    describe('create', () => {
        it('creates a question analytics row with every decimal coerced', () => {
            const analytics = ReportAnalyticsDomain.create({
                id: 100,
                ...baseProps,
                averageBySelfAssessment: 4,
                averageByTeam: 3.5,
                averageByOther: '4.25',
                percentageBySelfAssessment: 80,
                percentageByTeam: 70,
                percentageByOther: 85,
                deltaPercentageByTeam: -10,
                deltaPercentageByOther: 5,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(analytics.id).toBe(100);
            expect(analytics.reportId).toBe(1);
            expect(analytics.entityType).toBe(EntityType.QUESTION);
            expect(analytics.questionId).toBe(10);
            expect(analytics.averageByOther).toBeInstanceOf(Decimal);
            expect(analytics.averageByOther!.toString()).toBe('4.25');
            expect(analytics.deltaPercentageByTeam!.toNumber()).toBe(-10);
        });

        it('creates a competence analytics row, normalising missing question fields to null', () => {
            const analytics = ReportAnalyticsDomain.create({
                reportId: 2,
                entityType: EntityType.COMPETENCE,
                questionId: null,
                questionTitle: null,
                competenceId: 5,
                competenceTitle: 'Leadership',
            });

            expect(analytics.entityType).toBe(EntityType.COMPETENCE);
            expect(analytics.competenceId).toBe(5);
            expect(analytics.competenceTitle).toBe('Leadership');
            expect(analytics.questionId).toBeNull();
            expect(analytics.questionTitle).toBeNull();
        });

        it('defaults all decimal fields to null when missing', () => {
            const analytics = ReportAnalyticsDomain.create(baseProps);

            expect(analytics.averageBySelfAssessment).toBeNull();
            expect(analytics.averageByTeam).toBeNull();
            expect(analytics.averageByOther).toBeNull();
            expect(analytics.percentageBySelfAssessment).toBeNull();
            expect(analytics.percentageByTeam).toBeNull();
            expect(analytics.percentageByOther).toBeNull();
            expect(analytics.deltaPercentageByTeam).toBeNull();
            expect(analytics.deltaPercentageByOther).toBeNull();
        });
    });
});
