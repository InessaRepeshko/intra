export type ClusterScoreAnalyticsProps = {
    id?: number;
    cycleId: number;
    clusterId: number;
    employeesCount: number;
    minScore: number;
    maxScore: number;
    averageScore: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export class ClusterScoreAnalyticsDomain {
    readonly id?: number;
    readonly cycleId: number;
    readonly clusterId: number;
    readonly employeesCount: number;
    readonly minScore: number;
    readonly maxScore: number;
    readonly averageScore: number;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    private constructor(props: ClusterScoreAnalyticsProps) {
        this.id = props.id;
        this.cycleId = props.cycleId;
        this.clusterId = props.clusterId;
        this.employeesCount = props.employeesCount;
        this.minScore = props.minScore;
        this.maxScore = props.maxScore;
        this.averageScore = props.averageScore;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static create(
        props: ClusterScoreAnalyticsProps,
    ): ClusterScoreAnalyticsDomain {
        return new ClusterScoreAnalyticsDomain(props);
    }
}
