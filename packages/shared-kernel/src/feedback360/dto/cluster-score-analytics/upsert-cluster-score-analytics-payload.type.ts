export type UpsertClusterScoreAnalyticsPayload = {
    cycleId: number;
    clusterId: number;
    employeesCount: number;
    lowerBound: number;
    upperBound: number;
    minScore: number;
    maxScore: number;
    averageScore: number;
};
