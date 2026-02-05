import { EntityType, ReportTextAnswerDto } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { ReportAnalyticsDomain } from '../../../domain/report-analytics.domain';
import { ReportCommentDomain } from '../../../domain/report-comment.domain';
import { ReportDomain } from '../../../domain/report.domain';
import { CompetenceSummaryTotalsResponse } from '../models/competence-summary-totals.response';
import { CompetenceSummaryResponse } from '../models/competence-summary.response';
import { QuestionSummaryResponse } from '../models/question-summary.response';
import { ReportAnalyticsResponse } from '../models/report-analytics.response';
import { ReportCommentResponse } from '../models/report-comment.response';
import { ReportResponse } from '../models/report.response';
import { TextAnswerResponse } from '../models/text-answer.response';

export class ReportingHttpMapper {
    static toReportResponse(report: ReportDomain): ReportResponse {
        const response = new ReportResponse();
        response.id = report.id!;
        response.reviewId = report.reviewId;
        response.cycleId = report.cycleId ?? null;
        response.respondentCount = report.respondentCount;
        response.turnoutOfTeam = this.round(report.turnoutOfTeam);
        response.turnoutOfOther = this.round(report.turnoutOfOther);
        response.totalAverageBySelfAssessment = this.round(
            report.totalAverageBySelfAssessment,
        );
        response.totalAverageByTeam = this.round(report.totalAverageByTeam);
        response.totalAverageByOthers = this.round(report.totalAverageByOthers);
        response.totalDeltaByTeam = this.round(report.totalDeltaByTeam);
        response.totalDeltaByOthers = this.round(report.totalDeltaByOthers);
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
            this.toCompetenceSummaryTotalsResponse(report);

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
        response.averageBySelfAssessment = this.round(
            analytics.averageBySelfAssessment,
        );
        response.averageByTeam = this.round(analytics.averageByTeam);
        response.averageByOther = this.round(analytics.averageByOther);
        response.deltaByTeam = this.round(analytics.deltaByTeam);
        response.deltaByOther = this.round(analytics.deltaByOther);
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
        response.respondentCategories = comment.respondentCategories;
        response.commentSentiment = comment.commentSentiment ?? null;
        response.numberOfMentions = comment.numberOfMentions;
        response.createdAt = comment.createdAt!;
        return response;
    }

    static toTextAnswerResponse(
        answer: ReportTextAnswerDto,
    ): TextAnswerResponse {
        const response = new TextAnswerResponse();
        response.questionId = answer.questionId;
        response.questionTitle = answer.questionTitle ?? null;
        response.respondentCategory = answer.respondentCategory;
        response.textValue = answer.textValue;
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
        response.averageBySelfAssessment = this.round(
            analytics.averageBySelfAssessment,
        );
        response.averageByTeam = this.round(analytics.averageByTeam);
        response.averageByOther = this.round(analytics.averageByOther);
        response.deltaByTeam = this.round(analytics.deltaByTeam);
        response.deltaByOther = this.round(analytics.deltaByOther);
        return response;
    }

    private static toCompetenceSummaryResponse(
        analytics: ReportAnalyticsDomain,
    ): CompetenceSummaryResponse {
        const response = new CompetenceSummaryResponse();
        response.competenceId = analytics.competenceId ?? 0;
        response.competenceTitle = analytics.competenceTitle ?? null;
        response.averageBySelfAssessment = this.round(
            analytics.averageBySelfAssessment,
        );
        response.averageByTeam = this.round(analytics.averageByTeam);
        response.averageByOther = this.round(analytics.averageByOther);
        response.deltaByTeam = this.round(analytics.deltaByTeam);
        response.deltaByOther = this.round(analytics.deltaByOther);
        return response;
    }

    private static toCompetenceSummaryTotalsResponse(
        report: ReportDomain,
    ): CompetenceSummaryTotalsResponse | null {
        const hasValues =
            report.totalAverageCompetenceBySelfAssessment !== null ||
            report.totalAverageCompetenceByTeam !== null ||
            report.totalAverageCompetenceByOthers !== null ||
            report.totalCompetencePercentageBySelfAssessment !== null ||
            report.totalCompetencePercentageByTeam !== null ||
            report.totalCompetencePercentageByOthers !== null;

        if (!hasValues) {
            return null;
        }

        const response = new CompetenceSummaryTotalsResponse();
        response.averageBySelfAssessment = this.round(
            report.totalAverageCompetenceBySelfAssessment,
        );
        response.averageByTeam = this.round(
            report.totalAverageCompetenceByTeam,
        );
        response.averageByOther = this.round(
            report.totalAverageCompetenceByOthers,
        );
        response.percentageBySelfAssessment = this.round(
            report.totalCompetencePercentageBySelfAssessment,
        );
        response.percentageByTeam = this.round(
            report.totalCompetencePercentageByTeam,
        );
        response.percentageByOther = this.round(
            report.totalCompetencePercentageByOthers,
        );
        return response;
    }

    private static round(
        value: Decimal | number | null | undefined,
    ): number | null {
        if (value === null || value === undefined) return null;
        const decimalValue =
            value instanceof Decimal ? value : new Decimal(value);
        return Number(decimalValue.toDecimalPlaces(4).toFixed(4));
    }
}
