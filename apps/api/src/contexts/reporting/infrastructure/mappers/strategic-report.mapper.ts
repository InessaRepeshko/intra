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
            rateeIds: report.rateeIds,
            respondentCount: report.respondentCount,
            respondentIds: report.respondentIds,
            answerCount: report.answerCount,
            reviewerCount: report.reviewerCount,
            reviewerIds: report.reviewerIds,
            teamCount: report.teamCount,
            teamIds: report.teamIds,
            positionCount: report.positionCount,
            positionIds: report.positionIds,
            competenceCount: report.competenceCount,
            competenceIds: report.competenceIds,
            questionCount: report.questionCount,
            questionIds: report.questionIds,
            turnoutAvgPctOfRatees: report.turnoutAvgPctOfRatees,
            turnoutAvgPctOfTeams: report.turnoutAvgPctOfTeams,
            turnoutAvgPctOfOthers: report.turnoutAvgPctOfOthers,
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
            rateeIds: report.rateeIds,
            respondentCount: report.respondentCount,
            respondentIds: report.respondentIds,
            answerCount: report.answerCount,
            reviewerCount: report.reviewerCount,
            reviewerIds: report.reviewerIds,
            teamCount: report.teamCount,
            teamIds: report.teamIds,
            positionCount: report.positionCount,
            positionIds: report.positionIds,
            competenceCount: report.competenceCount,
            competenceIds: report.competenceIds,
            questionCount: report.questionCount,
            questionIds: report.questionIds,
            turnoutAvgPctOfRatees: report.turnoutAvgPctOfRatees,
            turnoutAvgPctOfTeams: report.turnoutAvgPctOfTeams,
            turnoutAvgPctOfOthers: report.turnoutAvgPctOfOthers,
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
            rateeIds: domain.rateeIds,
            respondentCount: domain.respondentCount,
            respondentIds: domain.respondentIds,
            answerCount: domain.answerCount,
            reviewerCount: domain.reviewerCount,
            reviewerIds: domain.reviewerIds,
            teamCount: domain.teamCount,
            teamIds: domain.teamIds,
            positionCount: domain.positionCount,
            positionIds: domain.positionIds,
            competenceCount: domain.competenceCount,
            competenceIds: domain.competenceIds,
            questionCount: domain.questionCount,
            questionIds: domain.questionIds,
            turnoutAvgPctOfRatees:
                StrategicReportAnalyticsMapper.toDecimalString(
                    domain.turnoutAvgPctOfRatees,
                ),
            turnoutAvgPctOfTeams:
                StrategicReportAnalyticsMapper.toDecimalString(
                    domain.turnoutAvgPctOfTeams,
                ),
            turnoutAvgPctOfOthers:
                StrategicReportAnalyticsMapper.toDecimalString(
                    domain.turnoutAvgPctOfOthers,
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
