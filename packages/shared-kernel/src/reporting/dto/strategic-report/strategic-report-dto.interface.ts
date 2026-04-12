export interface StrategicReportBaseDto<TDate = Date> {
    id: number;
    cycleId: number;
    cycleTitle: string;
    rateeCount: number;
    rateeIds: number[];
    respondentCount: number;
    respondentIds: number[];
    answerCount: number;
    reviewerCount: number;
    reviewerIds: number[];
    teamCount: number;
    teamIds: number[];
    positionCount: number;
    positionIds: number[];
    competenceCount: number;
    competenceIds: number[];
    questionCount: number;
    questionIds: number[];
    turnoutAvgPctOfRatees?: number | null;
    turnoutAvgPctOfTeams?: number | null;
    turnoutAvgPctOfOthers?: number | null;
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
