import Decimal from 'decimal.js';

export type ClusterScoreAnalyticsProps = {
    id?: number;
    cycleId: number;
    clusterId: number;
    employeesCount: number;
    minScore: Decimal.Value;
    maxScore: Decimal.Value;
    averageScore: Decimal.Value;
    createdAt?: Date;
    updatedAt?: Date;
};

export class ClusterScoreAnalyticsDomain {
    readonly id?: number;
    readonly cycleId: number;
    readonly clusterId: number;
    readonly employeesCount: number;
    readonly minScore: Decimal;
    readonly maxScore: Decimal;
    readonly averageScore: Decimal;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    private constructor(props: ClusterScoreAnalyticsProps) {
        this.id = props.id;
        this.cycleId = props.cycleId;
        this.clusterId = props.clusterId;
        this.employeesCount = props.employeesCount;
        this.minScore = new Decimal(props.minScore);
        this.maxScore = new Decimal(props.maxScore);
        this.averageScore = new Decimal(props.averageScore);
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static create(
        props: ClusterScoreAnalyticsProps,
    ): ClusterScoreAnalyticsDomain {
        return new ClusterScoreAnalyticsDomain(props);
    }
}
