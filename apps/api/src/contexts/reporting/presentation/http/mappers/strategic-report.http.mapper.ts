import { StrategicReportDomain } from '../../../domain/strategic-report.domain';
import { StrategicReportResponse } from '../models/strategic-report.response';
import { StrategicReportAnalyticsHttpMapper } from './strategic-report-analytics.http.mapper';

export class StrategicReportHttpMapper {
    static toResponse(report: StrategicReportDomain): StrategicReportResponse {
        const response = new StrategicReportResponse();
        response.id = report.id!;
        response.cycleId = report.cycleId;
        response.cycleTitle = report.cycleTitle;
        response.rateeCount = report.rateeCount;
        response.respondentCount = report.respondentCount;
        response.answerCount = report.answerCount;
        response.reviewerCount = report.reviewerCount;
        response.teamCount = report.teamCount;
        response.positionCount = report.positionCount;
        response.competenceCount = report.competenceCount;
        response.questionCount = report.questionCount;
        response.turnoutPctOfRatees =
            StrategicReportAnalyticsHttpMapper.roundScore(
                report.turnoutPctOfRatees,
            );
        response.turnoutPctOfRespondents =
            StrategicReportAnalyticsHttpMapper.roundScore(
                report.turnoutPctOfRespondents,
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
        return response;
    }
}
