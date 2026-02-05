import {
    Prisma,
    CommentSentiment as PrismaCommentSentiment,
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
import Decimal from 'decimal.js';
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
            turnoutPctOfTeam: report.turnoutPctOfTeam,
            turnoutPctOfOther: report.turnoutPctOfOther,
            questionTotAvgBySelf: report.questionTotAvgBySelf,
            questionTotAvgByTeam: report.questionTotAvgByTeam,
            questionTotAvgByOthers: report.questionTotAvgByOthers,
            questionTotPctBySelf: report.questionTotPctBySelf,
            questionTotPctByTeam: report.questionTotPctByTeam,
            questionTotPctByOthers: report.questionTotPctByOthers,
            questionTotDeltaPctByTeam: report.questionTotDeltaPctByTeam,
            questionTotDeltaPctByOthers: report.questionTotDeltaPctByOthers,
            competenceTotAvgBySelf: report.competenceTotAvgBySelf,
            competenceTotAvgByTeam: report.competenceTotAvgByTeam,
            competenceTotAvgByOthers: report.competenceTotAvgByOthers,
            competenceTotPctBySelf: report.competenceTotPctBySelf,
            competenceTotPctByTeam: report.competenceTotPctByTeam,
            competenceTotPctByOthers: report.competenceTotPctByOthers,
            competenceTotDeltaPctByTeam: report.competenceTotDeltaPctByTeam,
            competenceTotDeltaPctByOthers: report.competenceTotDeltaPctByOthers,
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
            percentageBySelfAssessment: analytics.percentageBySelfAssessment,
            percentageByTeam: analytics.percentageByTeam,
            percentageByOther: analytics.percentageByOther,
            deltaPercentageByTeam: analytics.deltaPercentageByTeam,
            deltaPercentageByOther: analytics.deltaPercentageByOther,
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
                analytics.averageBySelfAssessment !== null &&
                analytics.averageBySelfAssessment !== undefined
                    ? this.toDecimalString(analytics.averageBySelfAssessment)
                    : undefined,
            averageByTeam:
                analytics.averageByTeam !== null &&
                analytics.averageByTeam !== undefined
                    ? this.toDecimalString(analytics.averageByTeam)
                    : undefined,
            averageByOther:
                analytics.averageByOther !== null &&
                analytics.averageByOther !== undefined
                    ? this.toDecimalString(analytics.averageByOther)
                    : undefined,
            percentageBySelfAssessment:
                analytics.percentageBySelfAssessment !== null &&
                analytics.percentageBySelfAssessment !== undefined
                    ? this.toDecimalString(analytics.percentageBySelfAssessment)
                    : undefined,
            percentageByTeam:
                analytics.percentageByTeam !== null &&
                analytics.percentageByTeam !== undefined
                    ? this.toDecimalString(analytics.percentageByTeam)
                    : undefined,
            percentageByOther:
                analytics.percentageByOther !== null &&
                analytics.percentageByOther !== undefined
                    ? this.toDecimalString(analytics.percentageByOther)
                    : undefined,
            deltaPercentageByTeam:
                analytics.deltaPercentageByTeam !== null &&
                analytics.deltaPercentageByTeam !== undefined
                    ? this.toDecimalString(analytics.deltaPercentageByTeam)
                    : undefined,
            deltaPercentageByOther:
                analytics.deltaPercentageByOther !== null &&
                analytics.deltaPercentageByOther !== undefined
                    ? this.toDecimalString(analytics.deltaPercentageByOther)
                    : undefined,
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

    static toPrismaCommentSentiment(
        domainSentiment: CommentSentiment,
    ): PrismaCommentSentiment {
        return domainSentiment.toString() as PrismaCommentSentiment;
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
                    : this.toPrismaCommentSentiment(comment.commentSentiment!),
            numberOfMentions: comment.numberOfMentions,
        };
    }

    private static toDecimalString(value: Decimal.Value): string {
        return new Decimal(value).toDecimalPlaces(4).toFixed(4);
    }
}
