import Decimal from 'decimal.js';

export type ClusterScoreAnalyticsProps = {
    id?: number;
    cycleId: number;
    clusterId: number;
    lowerBound: Decimal.Value;
    upperBound: Decimal.Value;
    employeesCount: Decimal.Value;
    employeeDensity: Decimal.Value;
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
    readonly lowerBound: Decimal;
    readonly upperBound: Decimal;
    readonly employeesCount: Decimal;
    readonly employeeDensity: Decimal;
    readonly minScore: Decimal;
    readonly maxScore: Decimal;
    readonly averageScore: Decimal;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    private constructor(props: ClusterScoreAnalyticsProps) {
        this.id = props.id;
        this.cycleId = props.cycleId;
        this.clusterId = props.clusterId;
        this.lowerBound = new Decimal(props.lowerBound);
        this.upperBound = new Decimal(props.upperBound);
        this.employeesCount = new Decimal(props.employeesCount);
        this.employeeDensity = new Decimal(props.employeeDensity);
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
