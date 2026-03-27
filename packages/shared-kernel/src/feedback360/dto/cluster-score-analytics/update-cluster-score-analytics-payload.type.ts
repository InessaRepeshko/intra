export type UpdateClusterScoreAnalyticsPayload = Partial<{
    employeesCount: number;
    employeeDensity: number;
    minScore: number;
    maxScore: number;
    averageScore: number;
}>;
