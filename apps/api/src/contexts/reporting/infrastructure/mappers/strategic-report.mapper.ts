import {
    Prisma,
    StrategicReport as PrismaStrategicReport,
    StrategicReportAnalytics as PrismaStrategicReportAnalytics,
} from '@intra/database';
import { StrategicReportDomain } from '../../domain/strategic-report.domain';
import { StrategicReportAnalyticsMapper } from './strategic-report-analytics.mapper';

export class StrategicReportMapper {
    static toDomain(report: PrismaStrategicReport): StrategicReportDomain {
        return StrategicReportDomain.create({
            id: report.id,
            cycleId: report.cycleId,
            cycleTitle: report.cycleTitle,
            rateeCount: report.rateeCount,
            respondentCount: report.respondentCount,
            answerCount: report.answerCount,
            reviewerCount: report.reviewerCount,
            teamCount: report.teamCount,
            positionCount: report.positionCount,
            competenceCount: report.competenceCount,
            questionCount: report.questionCount,
            turnoutPctOfRatees: report.turnoutPctOfRatees,
            turnoutPctOfRespondents: report.turnoutPctOfRespondents,
            competenceGeneralAvgSelf: report.competenceGeneralAvgSelf,
            competenceGeneralAvgTeam: report.competenceGeneralAvgTeam,
            competenceGeneralAvgOther: report.competenceGeneralAvgOther,
            competenceGeneralPctSelf: report.competenceGeneralPctSelf,
            competenceGeneralPctTeam: report.competenceGeneralPctTeam,
            competenceGeneralPctOther: report.competenceGeneralPctOther,
            competenceGeneralDeltaTeam: report.competenceGeneralDeltaTeam,
            competenceGeneralDeltaOther: report.competenceGeneralDeltaOther,
            createdAt: report.createdAt,
            analytics: [],
        });
    }

    static toDomainWithRelations(
        report: PrismaStrategicReport & {
            analytics: PrismaStrategicReportAnalytics[];
        },
    ): StrategicReportDomain {
        return StrategicReportDomain.create({
            id: report.id,
            cycleId: report.cycleId,
            cycleTitle: report.cycleTitle,
            rateeCount: report.rateeCount,
            respondentCount: report.respondentCount,
            answerCount: report.answerCount,
            reviewerCount: report.reviewerCount,
            teamCount: report.teamCount,
            positionCount: report.positionCount,
            competenceCount: report.competenceCount,
            questionCount: report.questionCount,
            turnoutPctOfRatees: report.turnoutPctOfRatees,
            turnoutPctOfRespondents: report.turnoutPctOfRespondents,
            competenceGeneralAvgSelf: report.competenceGeneralAvgSelf,
            competenceGeneralAvgTeam: report.competenceGeneralAvgTeam,
            competenceGeneralAvgOther: report.competenceGeneralAvgOther,
            competenceGeneralPctSelf: report.competenceGeneralPctSelf,
            competenceGeneralPctTeam: report.competenceGeneralPctTeam,
            competenceGeneralPctOther: report.competenceGeneralPctOther,
            competenceGeneralDeltaTeam: report.competenceGeneralDeltaTeam,
            competenceGeneralDeltaOther: report.competenceGeneralDeltaOther,
            createdAt: report.createdAt,
            analytics: report.analytics.map((a) =>
                StrategicReportAnalyticsMapper.toDomain(a),
            ),
        });
    }

    static toPrisma(
        domain: StrategicReportDomain,
    ): Prisma.StrategicReportUncheckedCreateInput {
        return {
            cycleId: domain.cycleId,
            cycleTitle: domain.cycleTitle,
            rateeCount: domain.rateeCount,
            respondentCount: domain.respondentCount,
            answerCount: domain.answerCount,
            reviewerCount: domain.reviewerCount,
            teamCount: domain.teamCount,
            positionCount: domain.positionCount,
            competenceCount: domain.competenceCount,
            questionCount: domain.questionCount,
            turnoutPctOfRatees: StrategicReportAnalyticsMapper.toDecimalString(
                domain.turnoutPctOfRatees,
            ),
            turnoutPctOfRespondents:
                StrategicReportAnalyticsMapper.toDecimalString(
                    domain.turnoutPctOfRespondents,
                ),
            competenceGeneralAvgSelf:
                StrategicReportAnalyticsMapper.toDecimalString(
                    domain.competenceGeneralAvgSelf,
                ),
            competenceGeneralAvgTeam:
                StrategicReportAnalyticsMapper.toDecimalString(
                    domain.competenceGeneralAvgTeam,
                ),
            competenceGeneralAvgOther:
                StrategicReportAnalyticsMapper.toDecimalString(
                    domain.competenceGeneralAvgOther,
                ),
            competenceGeneralPctSelf:
                StrategicReportAnalyticsMapper.toDecimalString(
                    domain.competenceGeneralPctSelf,
                ),
            competenceGeneralPctTeam:
                StrategicReportAnalyticsMapper.toDecimalString(
                    domain.competenceGeneralPctTeam,
                ),
            competenceGeneralPctOther:
                StrategicReportAnalyticsMapper.toDecimalString(
                    domain.competenceGeneralPctOther,
                ),
            competenceGeneralDeltaTeam:
                StrategicReportAnalyticsMapper.toDecimalString(
                    domain.competenceGeneralDeltaTeam,
                ),
            competenceGeneralDeltaOther:
                StrategicReportAnalyticsMapper.toDecimalString(
                    domain.competenceGeneralDeltaOther,
                ),
        };
    }
}
