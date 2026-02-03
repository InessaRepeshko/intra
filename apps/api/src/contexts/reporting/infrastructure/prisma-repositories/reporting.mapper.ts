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
import { ReportAnalyticsDomain } from '../../domain/report-analytics.domain';
import { ReportCommentDomain } from '../../domain/report-comment.domain';
import { ReportDomain } from '../../domain/report.domain';

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
            respondentCount: report.respondentCount,
            turnoutOfTeam: report.turnoutOfTeam,
            turnoutOfOther: report.turnoutOfOther,
            totalAverageBySelfAssessment: report.totalAverageBySelfAssessment,
            totalAverageByTeam: report.totalAverageByTeam,
            totalAverageByOthers: report.totalAverageByOthers,
            totalDeltaBySelfAssessment: report.totalDeltaBySelfAssessment,
            totalDeltaByTeam: report.totalDeltaByTeam,
            totalDeltaByOthers: report.totalDeltaByOthers,
            createdAt: report.createdAt,
            analytics: report.analytics.map(this.toReportAnalyticsDomain),
            comments: report.comments.map(this.toReportCommentDomain),
        });
    }

    static toReportAnalyticsDomain(
        analytics: PrismaReportAnalytics,
    ): ReportAnalyticsDomain {
        return ReportAnalyticsDomain.create({
            id: analytics.id,
            reportId: analytics.reportId,
            entityType: analytics.entityType as EntityType,
            questionId: analytics.questionId,
            questionTitle: analytics.questionTitle,
            competenceId: analytics.competenceId,
            competenceTitle: analytics.competenceTitle,
            averageBySelfAssessment: analytics.averageBySelfAssessment,
            averageByTeam: analytics.averageByTeam,
            averageByOther: analytics.averageByOther,
            deltaBySelfAssessment: analytics.deltaBySelfAssessment,
            deltaByTeam: analytics.deltaByTeam,
            deltaByOther: analytics.deltaByOther,
            createdAt: analytics.createdAt,
        });
    }

    static toReportCommentDomain(
        comment: PrismaReportComment,
    ): ReportCommentDomain {
        return ReportCommentDomain.create({
            id: comment.id,
            reportId: comment.reportId,
            questionId: comment.questionId,
            questionTitle: comment.questionTitle,
            comment: comment.comment,
            respondentCategory:
                comment.respondentCategory as RespondentCategory,
            commentSentiment: comment.commentSentiment as CommentSentiment,
            numberOfMentions: comment.numberOfMentions,
            createdAt: comment.createdAt,
        });
    }
}
