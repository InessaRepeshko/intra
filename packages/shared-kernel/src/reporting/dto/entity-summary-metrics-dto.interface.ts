export interface EntitySummaryMetricsDto {
    averageBySelfAssessment?: number | null;
    averageByTeam?: number | null;
    averageByOther?: number | null;
    percentageBySelfAssessment?: number | null;
    percentageByTeam?: number | null;
    percentageByOther?: number | null;
    deltaPercentageByTeam?: number | null;
    deltaPercentageByOther?: number | null;
}
