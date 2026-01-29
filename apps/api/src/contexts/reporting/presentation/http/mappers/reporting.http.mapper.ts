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
        response.analytics = report.analytics.map(
            this.toReportAnalyticsResponse,
        );
        response.comments = report.comments.map(this.toReportCommentResponse);
        response.createdAt = report.createdAt!;
        return response;
    }

    static toReportAnalyticsResponse(
        analytics: ReportAnalyticsDomain,
    ): ReportAnalyticsResponse {
        const response = new ReportAnalyticsResponse();
        response.id = analytics.id!;
        response.reportId = analytics.reportId;
        response.entityType = analytics.entityType;
        response.entityId = analytics.entityId ?? null;
        response.entityTitle = analytics.entityTitle;
        response.averageBySelfAssessment =
            analytics.averageBySelfAssessment ?? null;
        response.averageByTeam = analytics.averageByTeam ?? null;
        response.averageByOther = analytics.averageByOther ?? null;
        response.deltaBySelfAssessment =
            analytics.deltaBySelfAssessment ?? null;
        response.deltaByTeam = analytics.deltaByTeam ?? null;
        response.deltaByOther = analytics.deltaByOther ?? null;
        response.dimension = analytics.dimension ?? null;
        response.createdAt = analytics.createdAt!;
        return response;
    }

    static toReportCommentResponse(
        comment: ReportCommentDomain,
    ): ReportCommentResponse {
        const response = new ReportCommentResponse();
        response.id = comment.id!;
        response.reportId = comment.reportId;
        response.comment = comment.comment ?? null;
        response.commentSentiment = comment.commentSentiment;
        response.numberOfMentions = comment.numberOfMentions ?? null;
        response.respondentCategory = comment.respondentCategory;
        response.createdAt = comment.createdAt!;
        return response;
    }
}
