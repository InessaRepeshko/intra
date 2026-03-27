export interface StrategicReportAnalyticsBaseDto<TDate = Date> {
    id: number;
    strategicReportId: number;
    competenceId: number;
    competenceTitle: string;
    averageBySelfAssessment?: number | null;
    averageByTeam?: number | null;
    averageByOther?: number | null;
    percentageBySelfAssessment?: number | null;
    percentageByTeam?: number | null;
    percentageByOther?: number | null;
    deltaPercentageByTeam?: number | null;
    deltaPercentageByOther?: number | null;
    createdAt: TDate;
}

export type StrategicReportAnalyticsDto = StrategicReportAnalyticsBaseDto<Date>;

export type StrategicReportAnalyticsResponseDto =
    StrategicReportAnalyticsBaseDto<string>;
