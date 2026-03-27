export interface StrategicReportBaseDto<TDate = Date> {
    id: number;
    cycleId?: number | null;
    rateeCount: number;
    respondentCount: number;
    answerCount: number;
    reviewerCount: number;
    teamCount: number;
    positionCount: number;
    competenceCount: number;
    questionCount: number;
    turnoutPctOfRatees?: number | null;
    turnoutPctOfRespondents?: number | null;
    competenceGeneralAvgSelf?: number | null;
    competenceGeneralAvgTeam?: number | null;
    competenceGeneralAvgOther?: number | null;
    competenceGeneralPctSelf?: number | null;
    competenceGeneralPctTeam?: number | null;
    competenceGeneralPctOther?: number | null;
    competenceGeneralDeltaTeam?: number | null;
    competenceGeneralDeltaOther?: number | null;
    createdAt: TDate;
}

export type StrategicReportDto = StrategicReportBaseDto<Date>;

export type StrategicReportResponseDto = StrategicReportBaseDto<string>;
