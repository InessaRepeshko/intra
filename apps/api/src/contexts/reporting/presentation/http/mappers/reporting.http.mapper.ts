import { EntityType, ReportTextAnswerDto } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { ReportAnalyticsDomain } from '../../../domain/report-analytics.domain';
import { ReportCommentDomain } from '../../../domain/report-comment.domain';
import { ReportDomain } from '../../../domain/report.domain';
import { CompetenceSummaryTotalsResponse } from '../models/competence-summary-totals.response';
import { CompetenceSummaryResponse } from '../models/competence-summary.response';
import { QuestionSummaryTotalsResponse } from '../models/question-summary-totals.response';
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
        response.turnoutPctOfTeam = this.round(report.turnoutPctOfTeam);
        response.turnoutPctOfOther = this.round(report.turnoutPctOfOther);
        response.createdAt = report.createdAt!;

        response.questionSummaries = report.analytics
            .filter((analytics) => analytics.entityType === EntityType.QUESTION)
            .map((a) => this.toQuestionSummaryResponse(a));
        response.questionSummaryTotals =
            this.toQuestionSummaryTotalsResponse(report);

        response.competenceSummaries = report.analytics
            .filter(
                (analytics) => analytics.entityType === EntityType.COMPETENCE,
            )
            .map((a) => this.toCompetenceSummaryResponse(a));
        response.competenceSummaryTotals =
            this.toCompetenceSummaryTotalsResponse(report);

        response.comments =
            report.comments?.map((c) => this.toReportCommentResponse(c)) ?? [];
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
        response.percentageBySelfAssessment = this.round(
            analytics.percentageBySelfAssessment,
        );
        response.percentageByTeam = this.round(analytics.percentageByTeam);
        response.percentageByOther = this.round(analytics.percentageByOther);
        response.deltaPercentageByTeam = this.round(
            analytics.deltaPercentageByTeam,
        );
        response.deltaPercentageByOther = this.round(
            analytics.deltaPercentageByOther,
        );
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
        response.averageBySelfAssessment = this.round(
            analytics.averageBySelfAssessment,
        );
        response.averageByTeam = this.round(analytics.averageByTeam);
        response.averageByOther = this.round(analytics.averageByOther);
        response.percentageBySelfAssessment = this.round(
            analytics.percentageBySelfAssessment,
        );
        response.percentageByTeam = this.round(analytics.percentageByTeam);
        response.percentageByOther = this.round(analytics.percentageByOther);
        response.deltaPercentageByTeam = this.round(
            analytics.deltaPercentageByTeam,
        );
        response.deltaPercentageByOther = this.round(
            analytics.deltaPercentageByOther,
        );
        return response;
    }

    private static toQuestionSummaryTotalsResponse(
        report: ReportDomain,
    ): QuestionSummaryTotalsResponse | null {
        const hasValues =
            report.questionTotAvgBySelf !== null ||
            report.questionTotAvgByTeam !== null ||
            report.questionTotAvgByOthers !== null ||
            report.questionTotPctBySelf !== null ||
            report.questionTotPctByTeam !== null ||
            report.questionTotPctByOthers !== null ||
            report.questionTotDeltaPctByTeam !== null ||
            report.questionTotDeltaPctByOthers !== null;

        if (!hasValues) {
            return null;
        }

        const response = new QuestionSummaryTotalsResponse();
        response.averageBySelfAssessment = this.round(
            report.questionTotAvgBySelf,
        );
        response.averageByTeam = this.round(report.questionTotAvgByTeam);
        response.averageByOther = this.round(report.questionTotAvgByOthers);
        response.percentageBySelfAssessment = this.round(
            report.questionTotPctBySelf,
        );
        response.percentageByTeam = this.round(report.questionTotPctByTeam);
        response.percentageByOther = this.round(report.questionTotPctByOthers);
        response.deltaPercentageByTeam = this.round(
            report.questionTotDeltaPctByTeam,
        );
        response.deltaPercentageByOther = this.round(
            report.questionTotDeltaPctByOthers,
        );
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
        response.percentageBySelfAssessment = this.round(
            analytics.percentageBySelfAssessment,
        );
        response.percentageByTeam = this.round(analytics.percentageByTeam);
        response.percentageByOther = this.round(analytics.percentageByOther);
        response.deltaPercentageByTeam = this.round(
            analytics.deltaPercentageByTeam,
        );
        response.deltaPercentageByOther = this.round(
            analytics.deltaPercentageByOther,
        );
        return response;
    }

    private static toCompetenceSummaryTotalsResponse(
        report: ReportDomain,
    ): CompetenceSummaryTotalsResponse | null {
        const hasValues =
            report.competenceTotAvgBySelf !== null ||
            report.competenceTotAvgByTeam !== null ||
            report.competenceTotAvgByOthers !== null ||
            report.competenceTotPctBySelf !== null ||
            report.competenceTotPctByTeam !== null ||
            report.competenceTotPctByOthers !== null ||
            report.competenceTotDeltaPctByTeam !== null ||
            report.competenceTotDeltaPctByOthers !== null;

        if (!hasValues) {
            return null;
        }

        const response = new CompetenceSummaryTotalsResponse();
        response.averageBySelfAssessment = this.round(
            report.competenceTotAvgBySelf,
        );
        response.averageByTeam = this.round(report.competenceTotAvgByTeam);
        response.averageByOther = this.round(report.competenceTotAvgByOthers);
        response.percentageBySelfAssessment = this.round(
            report.competenceTotPctBySelf,
        );
        response.percentageByTeam = this.round(report.competenceTotPctByTeam);
        response.percentageByOther = this.round(
            report.competenceTotPctByOthers,
        );
        response.deltaPercentageByTeam = this.round(
            report.competenceTotDeltaPctByTeam,
        );
        response.deltaPercentageByOther = this.round(
            report.competenceTotDeltaPctByOthers,
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
