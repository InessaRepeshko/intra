import { StrategicReportDomain } from '../../../domain/strategic-report.domain';
import { StrategicReportResponse } from '../models/strategic-report.response';
import { StrategicReportInsightHttpMapper } from './startegic-report-insight.http.mapper';
import { StrategicReportAnalyticsHttpMapper } from './strategic-report-analytics.http.mapper';

export class StrategicReportHttpMapper {
    static toResponse(report: StrategicReportDomain): StrategicReportResponse {
        const response = new StrategicReportResponse();
        response.id = report.id!;
        response.cycleId = report.cycleId;
        response.cycleTitle = report.cycleTitle;
        response.rateeCount = report.rateeCount;
        response.rateeIds = report.rateeIds ?? [];
        response.respondentCount = report.respondentCount;
        response.respondentIds = report.respondentIds ?? [];
        response.answerCount = report.answerCount;
        response.reviewerCount = report.reviewerCount;
        response.reviewerIds = report.reviewerIds ?? [];
        response.teamCount = report.teamCount;
        response.teamIds = report.teamIds ?? [];
        response.positionCount = report.positionCount;
        response.positionIds = report.positionIds ?? [];
        response.competenceCount = report.competenceCount;
        response.competenceIds = report.competenceIds ?? [];
        response.questionCount = report.questionCount;
        response.questionIds = report.questionIds ?? [];
        response.turnoutAvgPctOfRatees =
            StrategicReportAnalyticsHttpMapper.roundScore(
                report.turnoutAvgPctOfRatees,
            );
        response.turnoutAvgPctOfTeams =
            StrategicReportAnalyticsHttpMapper.roundScore(
                report.turnoutAvgPctOfTeams,
            );
        response.turnoutAvgPctOfOthers =
            StrategicReportAnalyticsHttpMapper.roundScore(
                report.turnoutAvgPctOfOthers,
            );
        response.competenceGeneralAvgSelf =
            StrategicReportAnalyticsHttpMapper.roundScore(
                report.competenceGeneralAvgSelf,
            );
        response.competenceGeneralAvgTeam =
            StrategicReportAnalyticsHttpMapper.roundScore(
                report.competenceGeneralAvgTeam,
            );
        response.competenceGeneralAvgOther =
            StrategicReportAnalyticsHttpMapper.roundScore(
                report.competenceGeneralAvgOther,
            );
        response.competenceGeneralPctSelf =
            StrategicReportAnalyticsHttpMapper.roundScore(
                report.competenceGeneralPctSelf,
            );
        response.competenceGeneralPctTeam =
            StrategicReportAnalyticsHttpMapper.roundScore(
                report.competenceGeneralPctTeam,
            );
        response.competenceGeneralPctOther =
            StrategicReportAnalyticsHttpMapper.roundScore(
                report.competenceGeneralPctOther,
            );
        response.competenceGeneralDeltaTeam =
            StrategicReportAnalyticsHttpMapper.roundScore(
                report.competenceGeneralDeltaTeam,
            );
        response.competenceGeneralDeltaOther =
            StrategicReportAnalyticsHttpMapper.roundScore(
                report.competenceGeneralDeltaOther,
            );
        response.createdAt = report.createdAt!;

        response.analytics =
            report.analytics?.map((c) =>
                StrategicReportAnalyticsHttpMapper.toResponse(c),
            ) ?? [];

        response.insights =
            report.insights?.map((c) =>
                StrategicReportInsightHttpMapper.toResponse(c),
            ) ?? [];
        return response;
    }
}
