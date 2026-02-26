export interface ReportBaseDto<TDate = Date> {
    id: number;
    reviewId: number;
    cycleId?: number | null;
    respondentCount: number;
    turnoutPctOfTeam?: number | null;
    turnoutPctOfOther?: number | null;
    questionTotAvgBySelf?: number | null;
    questionTotAvgByTeam?: number | null;
    questionTotAvgByOthers?: number | null;
    questionTotPctBySelf?: number | null;
    questionTotPctByTeam?: number | null;
    questionTotPctByOthers?: number | null;
    questionTotDeltaPctByTeam?: number | null;
    questionTotDeltaPctByOthers?: number | null;
    competenceTotAvgBySelf?: number | null;
    competenceTotAvgByTeam?: number | null;
    competenceTotAvgByOthers?: number | null;
    competenceTotPctBySelf?: number | null;
    competenceTotPctByTeam?: number | null;
    competenceTotPctByOthers?: number | null;
    competenceTotDeltaPctByTeam?: number | null;
    competenceTotDeltaPctByOthers?: number | null;
    createdAt: TDate;
}

export type ReportDto = ReportBaseDto<Date>;

export type ReportResponseDto = ReportBaseDto<string>;
