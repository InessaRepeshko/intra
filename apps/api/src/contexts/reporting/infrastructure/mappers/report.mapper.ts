import {
    Prisma,
    Report as PrismaReport,
    ReportAnalytics as PrismaReportAnalytics,
    ReportComment as PrismaReportComment,
    ReportInsights as PrismaReportInsight,
    RespondentCategory as PrismaRespondentCategory,
} from '@intra/database';
import { RespondentCategory } from '@intra/shared-kernel';
import { ReportDomain } from '../../domain/report.domain';
import { ReportAnalyticsMapper } from './report-analytics.mapper';
import { ReportCommentMapper } from './report-comment.mapper';
import { ReportInsightMapper } from './report-insight.mapper';

export class ReportMapper {
    static toDomain(report: PrismaReport): ReportDomain {
        return ReportDomain.create({
            id: report.id,
            reviewId: report.reviewId,
            cycleId: report.cycleId,
            respondentCount: report.respondentCount,
            respondentCategories: report.respondentCategories.map((c) =>
                ReportMapper.toDomainRespondentCategory(c),
            ),
            answerCount: report.answerCount,
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
            analytics: [],
            comments: [],
            insights: [],
        });
    }

    static toDomainWithRelations(
        report: PrismaReport & {
            analytics: PrismaReportAnalytics[];
            comments: PrismaReportComment[];
            insights: PrismaReportInsight[];
        },
    ): ReportDomain {
        return ReportDomain.create({
            id: report.id,
            reviewId: report.reviewId,
            cycleId: report.cycleId,
            respondentCount: report.respondentCount,
            respondentCategories: report.respondentCategories.map((c) =>
                ReportMapper.toDomainRespondentCategory(c),
            ),
            answerCount: report.answerCount,
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
            analytics: report.analytics.map((a) =>
                ReportAnalyticsMapper.toDomain(a),
            ),
            comments: report.comments.map((c) =>
                ReportCommentMapper.toDomain(c),
            ),
            insights: report.insights.map((i) =>
                ReportInsightMapper.toDomain(i),
            ),
        });
    }

    static toPrisma(domain: ReportDomain): Prisma.ReportUncheckedCreateInput {
        return {
            reviewId: domain.reviewId,
            cycleId: domain.cycleId,
            respondentCount: domain.respondentCount,
            respondentCategories: domain.respondentCategories.map((c) =>
                ReportMapper.toPrismaRespondentCategory(c),
            ),
            answerCount: domain.answerCount,
            turnoutPctOfTeam: ReportAnalyticsMapper.toDecimalString(
                domain.turnoutPctOfTeam,
            ),
            turnoutPctOfOther: ReportAnalyticsMapper.toDecimalString(
                domain.turnoutPctOfOther,
            ),
            questionTotAvgBySelf: ReportAnalyticsMapper.toDecimalString(
                domain.questionTotAvgBySelf,
            ),
            questionTotAvgByTeam: ReportAnalyticsMapper.toDecimalString(
                domain.questionTotAvgByTeam,
            ),
            questionTotAvgByOthers: ReportAnalyticsMapper.toDecimalString(
                domain.questionTotAvgByOthers,
            ),
            questionTotPctBySelf: ReportAnalyticsMapper.toDecimalString(
                domain.questionTotPctBySelf,
            ),
            questionTotPctByTeam: ReportAnalyticsMapper.toDecimalString(
                domain.questionTotPctByTeam,
            ),
            questionTotPctByOthers: ReportAnalyticsMapper.toDecimalString(
                domain.questionTotPctByOthers,
            ),
            questionTotDeltaPctByTeam: ReportAnalyticsMapper.toDecimalString(
                domain.questionTotDeltaPctByTeam,
            ),
            questionTotDeltaPctByOthers: ReportAnalyticsMapper.toDecimalString(
                domain.questionTotDeltaPctByOthers,
            ),
            competenceTotAvgBySelf: ReportAnalyticsMapper.toDecimalString(
                domain.competenceTotAvgBySelf,
            ),
            competenceTotAvgByTeam: ReportAnalyticsMapper.toDecimalString(
                domain.competenceTotAvgByTeam,
            ),
            competenceTotAvgByOthers: ReportAnalyticsMapper.toDecimalString(
                domain.competenceTotAvgByOthers,
            ),
            competenceTotPctBySelf: ReportAnalyticsMapper.toDecimalString(
                domain.competenceTotPctBySelf,
            ),
            competenceTotPctByTeam: ReportAnalyticsMapper.toDecimalString(
                domain.competenceTotPctByTeam,
            ),
            competenceTotPctByOthers: ReportAnalyticsMapper.toDecimalString(
                domain.competenceTotPctByOthers,
            ),
            competenceTotDeltaPctByTeam: ReportAnalyticsMapper.toDecimalString(
                domain.competenceTotDeltaPctByTeam,
            ),
            competenceTotDeltaPctByOthers:
                ReportAnalyticsMapper.toDecimalString(
                    domain.competenceTotDeltaPctByOthers,
                ),
        };
    }

    static toDomainRespondentCategory(
        category: PrismaRespondentCategory,
    ): RespondentCategory {
        return RespondentCategory[category];
    }

    static toPrismaRespondentCategory(
        category: RespondentCategory,
    ): PrismaRespondentCategory {
        return category.toString().toUpperCase() as PrismaRespondentCategory;
    }
}
