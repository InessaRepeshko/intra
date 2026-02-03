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
    totalDeltaBySelfAssessment?: number | null;
    totalDeltaByTeam?: number | null;
    totalDeltaByOthers?: number | null;
    createdAt?: Date;
}
