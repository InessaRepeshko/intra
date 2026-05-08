export interface ClusterScoreAnalyticsBaseDto<TDate = Date> {
    id: number;
    cycleId: number;
    clusterId: number;
    employeesCount: number;
    lowerBound: number;
    upperBound: number;
    minScore: number;
    maxScore: number;
    averageScore: number;
    createdAt: TDate;
    updatedAt: TDate;
}

export type ClusterScoreAnalyticsDto = ClusterScoreAnalyticsBaseDto<Date>;

export type ClusterScoreAnalyticsResponseDto =
    ClusterScoreAnalyticsBaseDto<string>;
