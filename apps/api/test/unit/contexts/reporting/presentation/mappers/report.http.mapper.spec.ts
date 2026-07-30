import {
    EntityType,
    InsightType,
    RespondentCategory,
} from '@intra/shared-kernel';
import { ReportAnalyticsDomain } from 'src/contexts/reporting/domain/report-analytics.domain';
import { ReportInsightDomain } from 'src/contexts/reporting/domain/report-insight.domain';
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';
import { ReportHttpMapper } from 'src/contexts/reporting/presentation/http/mappers/report.http.mapper';

describe('ReportHttpMapper', () => {
    describe('toResponse', () => {
        it('produces summary/totals/insights blocks split by entity type', () => {
            const questionAnalytic = ReportAnalyticsDomain.create({
                id: 1,
                reportId: 10,
                entityType: EntityType.QUESTION,
                questionId: 100,
                questionTitle: 'Q?',
                competenceId: null,
                competenceTitle: null,
                averageBySelfAssessment: 4,
                averageByTeam: 3.5,
                averageByOther: 4,
                percentageBySelfAssessment: 80,
                percentageByTeam: 70,
                percentageByOther: 80,
                deltaPercentageByTeam: -10,
                deltaPercentageByOther: 0,
            });
            const competenceAnalytic = ReportAnalyticsDomain.create({
                id: 2,
                reportId: 10,
                entityType: EntityType.COMPETENCE,
                questionId: null,
                questionTitle: null,
                competenceId: 5,
                competenceTitle: 'Teamwork',
                averageBySelfAssessment: 4.5,
                averageByTeam: 3.8,
                averageByOther: 4.1,
                percentageBySelfAssessment: 90,
                percentageByTeam: 76,
                percentageByOther: 82,
                deltaPercentageByTeam: -14,
                deltaPercentageByOther: -8,
            });
            const questionInsight = ReportInsightDomain.create({
                id: 1,
                reportId: 10,
                insightType: InsightType.HIGHEST_RATING,
                entityType: EntityType.QUESTION,
                questionId: 100,
                questionTitle: 'Q?',
                competenceId: null,
                competenceTitle: null,
                averageScore: 4,
                averageRating: 80,
                averageDelta: -10,
            });
            const competenceInsight = ReportInsightDomain.create({
                id: 2,
                reportId: 10,
                insightType: InsightType.LOWEST_RATING,
                entityType: EntityType.COMPETENCE,
                questionId: null,
                questionTitle: null,
                competenceId: 5,
                competenceTitle: 'Teamwork',
                averageScore: 3.8,
                averageRating: 76,
                averageDelta: -14,
            });

            const report = ReportDomain.create({
                id: 10,
                reviewId: 1,
                respondentCount: 5,
                respondentCategories: [RespondentCategory.TEAM],
                answerCount: 20,
                turnoutPctOfTeam: 75.5,
                turnoutPctOfOther: 80,
                questionTotAvgBySelf: 4,
                questionTotAvgByTeam: 3.5,
                questionTotAvgByOthers: 4,
                questionTotPctBySelf: 80,
                questionTotPctByTeam: 70,
                questionTotPctByOthers: 80,
                questionTotDeltaPctByTeam: -10,
                questionTotDeltaPctByOthers: 0,
                competenceTotAvgBySelf: 4.5,
                competenceTotAvgByTeam: 3.8,
                competenceTotAvgByOthers: 4.1,
                competenceTotPctBySelf: 90,
                competenceTotPctByTeam: 76,
                competenceTotPctByOthers: 82,
                competenceTotDeltaPctByTeam: -14,
                competenceTotDeltaPctByOthers: -8,
                analytics: [questionAnalytic, competenceAnalytic],
                insights: [questionInsight, competenceInsight],
                comments: [],
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            const response = ReportHttpMapper.toResponse(report);

            expect(response.id).toBe(10);
            expect(response.reviewId).toBe(1);
            expect(response.respondentCategories).toEqual([
                RespondentCategory.TEAM,
            ]);
            expect(response.turnoutPctOfTeam).toBe(75.5);
            expect(response.questionSummaries).toHaveLength(1);
            expect(response.questionSummaries[0].questionId).toBe(100);
            expect(response.competenceSummaries).toHaveLength(1);
            expect(response.competenceSummaries[0].competenceId).toBe(5);
            expect(response.questionSummaryTotals).not.toBeNull();
            expect(
                response.questionSummaryTotals!.averageBySelfAssessment,
            ).toBe(4);
            expect(response.competenceSummaryTotals).not.toBeNull();
            expect(response.questionInsights).toHaveLength(1);
            expect(response.competenceInsights).toHaveLength(1);
            expect(response.analytics).toHaveLength(2);
        });

        it('returns null totals blocks when every summary field is null', () => {
            const report = ReportDomain.create({
                id: 1,
                reviewId: 1,
                respondentCount: 1,
                respondentCategories: [RespondentCategory.TEAM],
                answerCount: 1,
                analytics: [],
            });

            const response = ReportHttpMapper.toResponse(report);

            expect(response.questionSummaryTotals).toBeNull();
            expect(response.competenceSummaryTotals).toBeNull();
            expect(response.questionSummaries).toEqual([]);
            expect(response.competenceSummaries).toEqual([]);
        });
    });

    describe('toTextAnswerResponse', () => {
        it('maps a ReportTextAnswerDto onto a TextAnswerResponse', () => {
            const response = ReportHttpMapper.toTextAnswerResponse({
                questionId: 1,
                questionTitle: 'Q?',
                respondentCategory: RespondentCategory.TEAM,
                textValue: 'Great teammate',
            });

            expect(response.questionId).toBe(1);
            expect(response.questionTitle).toBe('Q?');
            expect(response.respondentCategory).toBe(RespondentCategory.TEAM);
            expect(response.textValue).toBe('Great teammate');
        });

        it('returns null questionTitle when none is provided', () => {
            const response = ReportHttpMapper.toTextAnswerResponse({
                questionId: 1,
                questionTitle: null,
                respondentCategory: RespondentCategory.OTHER,
                textValue: 'x',
            });

            expect(response.questionTitle).toBeNull();
        });
    });
});
