export type UpdateClusterScoreAnalyticsPayload = Partial<{
    employeesCount: number;
    minScore: number;
    maxScore: number;
    averageScore: number;
}>;
