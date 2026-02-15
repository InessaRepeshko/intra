export enum ClusterScoreAnalyticsSortField {
    ID = 'id',
    CYCLE_ID = 'cycleId',
    CLUSTER_ID = 'clusterId',
    EMPLOYEES_COUNT = 'employeesCount',
    LOWER_BOUND = 'lowerBound',
    UPPER_BOUND = 'upperBound',
    MIN_SCORE = 'minScore',
    MAX_SCORE = 'maxScore',
    AVERAGE_SCORE = 'averageScore',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export const CLUSTER_SCORE_ANALYTICS_SORT_FIELDS = Object.values(
    ClusterScoreAnalyticsSortField,
);
