import { EntityType, REPORT_ANALYTICS_CONSTRAINTS } from '@intra/shared-kernel';
import { ReportAnalyticsDomain } from '../../../domain/report-analytics.domain';
import { ReportCommentDomain } from '../../../domain/report-comment.domain';
import { ReportDomain } from '../../../domain/report.domain';
import { CompetenceSummaryTotalsResponse } from '../models/competence-summary-totals.response';
import { CompetenceSummaryResponse } from '../models/competence-summary.response';
import { QuestionSummaryResponse } from '../models/question-summary.response';
import { ReportAnalyticsResponse } from '../models/report-analytics.response';
import { ReportCommentResponse } from '../models/report-comment.response';
import { ReportResponse } from '../models/report.response';

export class ReportingHttpMapper {
    static toReportResponse(report: ReportDomain): ReportResponse {
        const response = new ReportResponse();
        response.id = report.id!;
        response.reviewId = report.reviewId;
        response.cycleId = report.cycleId ?? null;
        response.respondentCount = report.respondentCount;
        response.turnoutOfTeam = report.turnoutOfTeam ?? null;
        response.turnoutOfOther = report.turnoutOfOther ?? null;
        response.totalAverageBySelfAssessment =
            report.totalAverageBySelfAssessment ?? null;
        response.totalAverageByTeam = report.totalAverageByTeam ?? null;
        response.totalAverageByOthers = report.totalAverageByOthers ?? null;
        response.totalDeltaBySelfAssessment =
            report.totalDeltaBySelfAssessment ?? null;
        response.totalDeltaByTeam = report.totalDeltaByTeam ?? null;
        response.totalDeltaByOthers = report.totalDeltaByOthers ?? null;
        response.createdAt = report.createdAt!;
        response.analytics = report.analytics.map(
            this.toReportAnalyticsResponse,
        );

        const questionAnalytics = report.analytics.filter(
            (analytics) => analytics.entityType === EntityType.QUESTION,
        );
        response.questionSummaries = questionAnalytics.map(
            this.toQuestionSummaryResponse,
        );

        const competenceAnalytics = report.analytics.filter(
            (analytics) => analytics.entityType === EntityType.COMPETENCE,
        );
        response.competenceSummaries = competenceAnalytics.map(
            this.toCompetenceSummaryResponse,
        );
        response.competenceSummaryTotals =
            this.buildCompetenceSummaryTotals(competenceAnalytics);

        response.comments =
            report.comments?.map(this.toReportCommentResponse) ?? [];
        return response;
    }

    static toReportAnalyticsResponse(
        analytics: ReportAnalyticsDomain,
    ): ReportAnalyticsResponse {
        const response = new ReportAnalyticsResponse();
        response.id = analytics.id!;
        response.reportId = analytics.reportId;
        response.entityType = analytics.entityType;
        response.questionId = analytics.questionId ?? null;
        response.questionTitle = analytics.questionTitle ?? null;
        response.competenceId = analytics.competenceId ?? null;
        response.competenceTitle = analytics.competenceTitle ?? null;
        response.averageBySelfAssessment =
            analytics.averageBySelfAssessment ?? null;
        response.averageByTeam = analytics.averageByTeam ?? null;
        response.averageByOther = analytics.averageByOther ?? null;
        response.deltaBySelfAssessment =
            analytics.deltaBySelfAssessment ?? null;
        response.deltaByTeam = analytics.deltaByTeam ?? null;
        response.deltaByOther = analytics.deltaByOther ?? null;
        response.createdAt = analytics.createdAt!;
        return response;
    }

    static toReportCommentResponse(
        comment: ReportCommentDomain,
    ): ReportCommentResponse {
        const response = new ReportCommentResponse();
        response.id = comment.id!;
        response.reportId = comment.reportId;
        response.questionId = comment.questionId;
        response.questionTitle = comment.questionTitle;
        response.comment = comment.comment;
        response.respondentCategory = comment.respondentCategory;
        response.commentSentiment = comment.commentSentiment ?? null;
        response.numberOfMentions = comment.numberOfMentions;
        response.createdAt = comment.createdAt!;
        return response;
    }

    private static toQuestionSummaryResponse(
        analytics: ReportAnalyticsDomain,
    ): QuestionSummaryResponse {
        const response = new QuestionSummaryResponse();
        response.questionId = analytics.questionId ?? 0;
        response.questionTitle = analytics.questionTitle ?? null;
        response.competenceId = analytics.competenceId ?? null;
        response.competenceTitle = analytics.competenceTitle ?? null;
        response.averageBySelfAssessment =
            analytics.averageBySelfAssessment ?? null;
        response.averageByTeam = analytics.averageByTeam ?? null;
        response.averageByOther = analytics.averageByOther ?? null;
        response.deltaByTeam = analytics.deltaByTeam ?? null;
        response.deltaByOther = analytics.deltaByOther ?? null;
        return response;
    }

    private static toCompetenceSummaryResponse(
        analytics: ReportAnalyticsDomain,
    ): CompetenceSummaryResponse {
        const response = new CompetenceSummaryResponse();
        response.competenceId = analytics.competenceId ?? 0;
        response.competenceTitle = analytics.competenceTitle ?? null;
        response.averageBySelfAssessment =
            analytics.averageBySelfAssessment ?? null;
        response.averageByTeam = analytics.averageByTeam ?? null;
        response.averageByOther = analytics.averageByOther ?? null;
        response.deltaByTeam = analytics.deltaByTeam ?? null;
        response.deltaByOther = analytics.deltaByOther ?? null;
        return response;
    }

    private static buildCompetenceSummaryTotals(
        analytics: ReportAnalyticsDomain[],
    ): CompetenceSummaryTotalsResponse | null {
        if (analytics.length === 0) {
            return null;
        }

        const averageBySelf = this.calculateAverage(
            analytics.map((item) => item.averageBySelfAssessment),
        );
        const averageByTeam = this.calculateAverage(
            analytics.map((item) => item.averageByTeam),
        );
        const averageByOther = this.calculateAverage(
            analytics.map((item) => item.averageByOther),
        );

        const maxScore = REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX;
        const percentageBySelf = this.calculatePercentage(
            averageBySelf,
            maxScore,
        );
        const percentageByTeam = this.calculatePercentage(
            averageByTeam,
            maxScore,
        );
        const percentageByOther = this.calculatePercentage(
            averageByOther,
            maxScore,
        );

        const totals = new CompetenceSummaryTotalsResponse();
        totals.averageBySelfAssessment = this.round(averageBySelf);
        totals.averageByTeam = this.round(averageByTeam);
        totals.averageByOther = this.round(averageByOther);
        totals.percentageBySelfAssessment = this.round(percentageBySelf);
        totals.percentageByTeam = this.round(percentageByTeam);
        totals.percentageByOther = this.round(percentageByOther);
        return totals;
    }

    private static calculateAverage(
        numbers: (number | null | undefined)[],
    ): number | null {
        const validNumbers = numbers.filter(
            (n): n is number => n !== null && n !== undefined,
        );
        if (validNumbers.length === 0) return null;
        return validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length;
    }

    private static calculatePercentage(
        value: number | null,
        maxScore: number,
    ): number | null {
        if (value === null || maxScore === 0) {
            return null;
        }
        return (value / maxScore) * 100;
    }

    private static round(value: number | null | undefined): number | null {
        if (value === null || value === undefined) {
            return null;
        }
        return Math.round(value * 100) / 100;
    }
}
