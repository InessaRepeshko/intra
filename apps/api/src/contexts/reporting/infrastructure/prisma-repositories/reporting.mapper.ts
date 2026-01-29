import {
    Report as PrismaReport,
    ReportAnalytics as PrismaReportAnalytics,
    ReportComment as PrismaReportComment,
} from '@intra/database';
import {
    CommentSentiment,
    EntityType,
    RespondentCategory,
} from '@intra/shared-kernel';
import { ReportDomain } from '../../domain/report.domain';
import { ReportAnalyticsDomain } from '../../domain/report-analytics.domain';
import { ReportCommentDomain } from '../../domain/report-comment.domain';

export class ReportingMapper {
    static toReportDomain(
        report: PrismaReport & {
            analytics: PrismaReportAnalytics[];
            comments: PrismaReportComment[];
        },
    ): ReportDomain {
        return ReportDomain.create({
            id: report.id,
            reviewId: report.reviewId,
            cycleId: report.cycleId,
            turnoutOfTeam: report.turnoutOfTeam,
            turnoutOfOther: report.turnoutOfOther,
            totalAverageBySelfAssessment:
                report.totalAverageBySelfAssessment,
            totalAverageByTeam: report.totalAverageByTeam,
            totalAverageByOthers: report.totalAverageByOthers,
            totalDeltaBySelfAssessment:
                report.totalDeltaBySelfAssessment,
            totalDeltaByTeam: report.totalDeltaByTeam,
            totalDeltaByOthers: report.totalDeltaByOthers,
            analytics: report.analytics.map(this.toReportAnalyticsDomain),
            comments: report.comments.map(this.toReportCommentDomain),
            createdAt: report.createdAt,
        });
    }

    static toReportAnalyticsDomain(
        analytics: PrismaReportAnalytics,
    ): ReportAnalyticsDomain {
        return ReportAnalyticsDomain.create({
            id: analytics.id,
            reportId: analytics.reportId,
            entityType: analytics.entityType as EntityType,
            entityId: analytics.entityId,
            entityTitle: analytics.entityTitle,
            averageBySelfAssessment: analytics.averageBySelfAssessment,
            averageByTeam: analytics.averageByTeam,
            averageByOther: analytics.averageByOther,
            deltaBySelfAssessment: analytics.deltaBySelfAssessment,
            deltaByTeam: analytics.deltaByTeam,
            deltaByOther: analytics.deltaByOther,
            dimension: analytics.dimension,
            createdAt: analytics.createdAt,
        });
    }

    static toReportCommentDomain(
        comment: PrismaReportComment,
    ): ReportCommentDomain {
        return ReportCommentDomain.create({
            id: comment.id,
            reportId: comment.reportId,
            comment: comment.comment,
            commentSentiment: comment.commentSentiment as CommentSentiment,
            numberOfMentions: comment.numberOfMentions,
            respondentCategory: comment.respondentCategory as RespondentCategory,
            createdAt: comment.createdAt,
        });
    }
}
