export type UpsertCycleClusterAnalyticsPayload = {
    cycleId: number;
    clusterId: number;
    employeesCount: number;
    minScore: number;
    maxScore: number;
    averageScore: number;
};
