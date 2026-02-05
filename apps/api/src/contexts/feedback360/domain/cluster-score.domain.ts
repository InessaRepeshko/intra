import Decimal from 'decimal.js';

export type ClusterScoreProps = {
    id?: number;
    cycleId?: number | null;
    clusterId: number;
    rateeId: number;
    reviewId: number;
    score: Decimal.Value;
    answersCount: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export class ClusterScoreDomain {
    readonly id?: number;
    readonly cycleId?: number | null;
    readonly clusterId: number;
    readonly rateeId: number;
    readonly reviewId: number;
    readonly score: Decimal;
    readonly answersCount: number;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    private constructor(props: ClusterScoreProps) {
        this.id = props.id;
        this.cycleId = props.cycleId ?? null;
        this.clusterId = props.clusterId;
        this.rateeId = props.rateeId;
        this.reviewId = props.reviewId;
        this.score = new Decimal(props.score);
        this.answersCount = props.answersCount;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static create(props: ClusterScoreProps): ClusterScoreDomain {
        return new ClusterScoreDomain(props);
    }
}
