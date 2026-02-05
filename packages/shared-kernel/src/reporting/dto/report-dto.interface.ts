export interface ReportDto {
    id: number;
    reviewId: number;
    cycleId?: number | null;
    respondentCount: number;
    turnoutOfTeam?: number | null;
    turnoutOfOther?: number | null;
    totalAverageBySelfAssessment?: number | null;
    totalAverageByTeam?: number | null;
    totalAverageByOthers?: number | null;
    totalDeltaByTeam?: number | null;
    totalDeltaByOthers?: number | null;
    totalAverageCompetenceBySelfAssessment?: number | null;
    totalAverageCompetenceByTeam?: number | null;
    totalAverageCompetenceByOthers?: number | null;
    totalCompetencePercentageBySelfAssessment?: number | null;
    totalCompetencePercentageByTeam?: number | null;
    totalCompetencePercentageByOthers?: number | null;
    createdAt?: Date;
}
