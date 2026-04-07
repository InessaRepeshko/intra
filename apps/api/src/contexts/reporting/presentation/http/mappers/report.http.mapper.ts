import { EntityType, ReportTextAnswerDto } from '@intra/shared-kernel';
import { ReportAnalyticsDomain } from '../../../domain/report-analytics.domain';
import { ReportDomain } from '../../../domain/report.domain';
import { CompetenceSummaryTotalsResponse } from '../models/competence-summary-totals.response';
import { CompetenceSummaryResponse } from '../models/competence-summary.response';
import { QuestionSummaryTotalsResponse } from '../models/question-summary-totals.response';
import { QuestionSummaryResponse } from '../models/question-summary.response';
import { ReportResponse } from '../models/report.response';
import { TextAnswerResponse } from '../models/text-answer.response';
import { ReportAnalyticsHttpMapper } from './report-analytics.http.mapper';
import { ReportCommentHttpMapper } from './report-comment.http.mapper';

export class ReportHttpMapper {
    static toResponse(report: ReportDomain): ReportResponse {
        const response = new ReportResponse();
        response.id = report.id!;
        response.reviewId = report.reviewId;
        response.cycleId = report.cycleId ?? null;
        response.respondentCount = report.respondentCount;
        response.respondentCategories = report.respondentCategories;
        response.answerCount = report.answerCount;
        response.turnoutPctOfTeam = ReportAnalyticsHttpMapper.roundScore(
            report.turnoutPctOfTeam,
        );
        response.turnoutPctOfOther = ReportAnalyticsHttpMapper.roundScore(
            report.turnoutPctOfOther,
        );
        response.createdAt = report.createdAt!;

        response.questionSummaries = report.analytics
            .filter((analytics) => analytics.entityType === EntityType.QUESTION)
            .map((a) => ReportHttpMapper.toQuestionSummaryResponse(a));
        response.questionSummaryTotals =
            ReportHttpMapper.toQuestionSummaryTotalsResponse(report);

        response.competenceSummaries = report.analytics
            .filter(
                (analytics) => analytics.entityType === EntityType.COMPETENCE,
            )
            .map((a) => ReportHttpMapper.toCompetenceSummaryResponse(a));
        response.competenceSummaryTotals =
            ReportHttpMapper.toCompetenceSummaryTotalsResponse(report);

        response.comments =
            report.comments?.map((c) =>
                ReportCommentHttpMapper.toResponse(c),
            ) ?? [];
        return response;
    }

    private static toQuestionSummaryResponse(
        analytics: ReportAnalyticsDomain,
    ): QuestionSummaryResponse {
        const response = new QuestionSummaryResponse();
        response.questionId = analytics.questionId ?? 0;
        response.questionTitle = analytics.questionTitle ?? null;
        response.averageBySelfAssessment = ReportAnalyticsHttpMapper.roundScore(
            analytics.averageBySelfAssessment,
        );
        response.averageByTeam = ReportAnalyticsHttpMapper.roundScore(
            analytics.averageByTeam,
        );
        response.averageByOther = ReportAnalyticsHttpMapper.roundScore(
            analytics.averageByOther,
        );
        response.percentageBySelfAssessment =
            ReportAnalyticsHttpMapper.roundScore(
                analytics.percentageBySelfAssessment,
            );
        response.percentageByTeam = ReportAnalyticsHttpMapper.roundScore(
            analytics.percentageByTeam,
        );
        response.percentageByOther = ReportAnalyticsHttpMapper.roundScore(
            analytics.percentageByOther,
        );
        response.deltaPercentageByTeam = ReportAnalyticsHttpMapper.roundScore(
            analytics.deltaPercentageByTeam,
        );
        response.deltaPercentageByOther = ReportAnalyticsHttpMapper.roundScore(
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
        response.averageBySelfAssessment = ReportAnalyticsHttpMapper.roundScore(
            report.questionTotAvgBySelf,
        );
        response.averageByTeam = ReportAnalyticsHttpMapper.roundScore(
            report.questionTotAvgByTeam,
        );
        response.averageByOther = ReportAnalyticsHttpMapper.roundScore(
            report.questionTotAvgByOthers,
        );
        response.percentageBySelfAssessment =
            ReportAnalyticsHttpMapper.roundScore(report.questionTotPctBySelf);
        response.percentageByTeam = ReportAnalyticsHttpMapper.roundScore(
            report.questionTotPctByTeam,
        );
        response.percentageByOther = ReportAnalyticsHttpMapper.roundScore(
            report.questionTotPctByOthers,
        );
        response.deltaPercentageByTeam = ReportAnalyticsHttpMapper.roundScore(
            report.questionTotDeltaPctByTeam,
        );
        response.deltaPercentageByOther = ReportAnalyticsHttpMapper.roundScore(
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
        response.averageBySelfAssessment = ReportAnalyticsHttpMapper.roundScore(
            analytics.averageBySelfAssessment,
        );
        response.averageByTeam = ReportAnalyticsHttpMapper.roundScore(
            analytics.averageByTeam,
        );
        response.averageByOther = ReportAnalyticsHttpMapper.roundScore(
            analytics.averageByOther,
        );
        response.percentageBySelfAssessment =
            ReportAnalyticsHttpMapper.roundScore(
                analytics.percentageBySelfAssessment,
            );
        response.percentageByTeam = ReportAnalyticsHttpMapper.roundScore(
            analytics.percentageByTeam,
        );
        response.percentageByOther = ReportAnalyticsHttpMapper.roundScore(
            analytics.percentageByOther,
        );
        response.deltaPercentageByTeam = ReportAnalyticsHttpMapper.roundScore(
            analytics.deltaPercentageByTeam,
        );
        response.deltaPercentageByOther = ReportAnalyticsHttpMapper.roundScore(
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
        response.averageBySelfAssessment = ReportAnalyticsHttpMapper.roundScore(
            report.competenceTotAvgBySelf,
        );
        response.averageByTeam = ReportAnalyticsHttpMapper.roundScore(
            report.competenceTotAvgByTeam,
        );
        response.averageByOther = ReportAnalyticsHttpMapper.roundScore(
            report.competenceTotAvgByOthers,
        );
        response.percentageBySelfAssessment =
            ReportAnalyticsHttpMapper.roundScore(report.competenceTotPctBySelf);
        response.percentageByTeam = ReportAnalyticsHttpMapper.roundScore(
            report.competenceTotPctByTeam,
        );
        response.percentageByOther = ReportAnalyticsHttpMapper.roundScore(
            report.competenceTotPctByOthers,
        );
        response.deltaPercentageByTeam = ReportAnalyticsHttpMapper.roundScore(
            report.competenceTotDeltaPctByTeam,
        );
        response.deltaPercentageByOther = ReportAnalyticsHttpMapper.roundScore(
            report.competenceTotDeltaPctByOthers,
        );
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
}
