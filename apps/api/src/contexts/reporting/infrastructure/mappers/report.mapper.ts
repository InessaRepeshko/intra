import {
    Prisma,
    Report as PrismaReport,
    ReportAnalytics as PrismaReportAnalytics,
    ReportComment as PrismaReportComment,
} from '@intra/database';
import { ReportDomain } from '../../domain/report.domain';
import { ReportAnalyticsMapper } from './report-analytics.mapper';
import { ReportCommentMapper } from './report-comment.mapper';

export class ReportMapper {
    static toDomainWithRelations(
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
            analytics: report.analytics.map((a) =>
                ReportAnalyticsMapper.toDomain(a),
            ),
            comments: report.comments.map((c) =>
                ReportCommentMapper.toDomain(c),
            ),
        });
    }

    static toPrisma(domain: ReportDomain): Prisma.ReportUncheckedCreateInput {
        return {
            reviewId: domain.reviewId,
            cycleId: domain.cycleId,
            respondentCount: domain.respondentCount,
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
}
