import {
    $Enums,
    Prisma,
    EntityType as PrismaEntityType,
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
            totalAverageCompetenceBySelfAssessment:
                report.totalAverageCompetenceBySelfAssessment,
            totalAverageCompetenceByTeam: report.totalAverageCompetenceByTeam,
            totalAverageCompetenceByOthers:
                report.totalAverageCompetenceByOthers,
            totalCompetencePercentageBySelfAssessment:
                report.totalCompetencePercentageBySelfAssessment,
            totalCompetencePercentageByTeam:
                report.totalCompetencePercentageByTeam,
            totalCompetencePercentageByOthers:
                report.totalCompetencePercentageByOthers,
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

    static toPrismaReportAnalyticsCreateInput(
        reportId: number,
        analytics: ReportAnalyticsDomain,
    ): Prisma.ReportAnalyticsCreateManyInput {
        return {
            reportId,
            entityType: this.toPrismaEntityType(analytics.entityType),
            questionId: analytics.questionId ?? undefined,
            questionTitle: analytics.questionTitle ?? undefined,
            competenceId: analytics.competenceId ?? undefined,
            competenceTitle: analytics.competenceTitle ?? undefined,
            averageBySelfAssessment:
                analytics.averageBySelfAssessment ?? undefined,
            averageByTeam: analytics.averageByTeam ?? undefined,
            averageByOther: analytics.averageByOther ?? undefined,
            deltaBySelfAssessment: analytics.deltaBySelfAssessment ?? undefined,
            deltaByTeam: analytics.deltaByTeam ?? undefined,
            deltaByOther: analytics.deltaByOther ?? undefined,
        };
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
            respondentCategories:
                (comment.respondentCategories as RespondentCategory[]) ?? [],
            commentSentiment: comment.commentSentiment as CommentSentiment,
            numberOfMentions: comment.numberOfMentions,
            createdAt: comment.createdAt,
        });
    }

    static toPrismaEntityType(domainType: EntityType): PrismaEntityType {
        return domainType.toString() as PrismaEntityType;
    }

    static toPrismaReportCommentCreateInput(
        comment: ReportCommentDomain,
    ): Prisma.ReportCommentUncheckedCreateInput {
        return {
            reportId: comment.reportId,
            questionId: comment.questionId,
            questionTitle: comment.questionTitle,
            comment: comment.comment,
            respondentCategories: comment.respondentCategories,
            commentSentiment:
                comment.commentSentiment === null
                    ? undefined
                    : (comment.commentSentiment as unknown as $Enums.CommentSentiment),
            numberOfMentions: comment.numberOfMentions,
        };
    }
}
