import { ReportEntitySummaryTotalsDto } from '../report-entity-summary-totals-dto.interface';

export interface ReportBaseDto<TDate = Date> {
    id: number;
    reviewId: number;
    cycleId?: number | null;
    respondentCount: number;
    turnoutPctOfTeam?: number | null;
    turnoutPctOfOther?: number | null;
    questionSummaryTotals?: ReportEntitySummaryTotalsDto | null;
    competenceSummaryTotals?: ReportEntitySummaryTotalsDto | null;
    createdAt: TDate;
}

export type ReportDto = ReportBaseDto<Date>;

export type ReportResponseDto = ReportBaseDto<string>;
