export interface ClusterScoreAnalyticsDto {
    id: number;
    cycleId: number;
    clusterId: number;
    employeesCount: number;
    lowerBound: number;
    upperBound: number;
    minScore: number;
    maxScore: number;
    averageScore: number;
    createdAt: Date;
    updatedAt: Date;
}
