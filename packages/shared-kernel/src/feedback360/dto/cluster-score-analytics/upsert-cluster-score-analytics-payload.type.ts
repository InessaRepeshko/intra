export type UpsertClusterScoreAnalyticsPayload = {
    cycleId: number;
    clusterId: number;
    employeesCount: number;
    minScore: number;
    maxScore: number;
    averageScore: number;
};
