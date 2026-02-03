import { ReportAnalyticsDomain } from '../../../domain/report-analytics.domain';
import { ReportCommentDomain } from '../../../domain/report-comment.domain';
import { ReportDomain } from '../../../domain/report.domain';
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
        response.clusterId = analytics.clusterId ?? null;
        response.clusterTitle = analytics.clusterTitle ?? null;
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
}
