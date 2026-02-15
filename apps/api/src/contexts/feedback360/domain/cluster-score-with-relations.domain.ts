import Decimal from 'decimal.js';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';

export type ClusterScoreWithRelationsProps = {
    id?: number;
    cycleId?: number | null;
    clusterId: number;
    rateeId: number;
    reviewId: number;
    score: Decimal.Value;
    answersCount: number;
    createdAt?: Date;
    updatedAt?: Date;
    cluster: ClusterDomain;
    ratee: UserDomain;
};

export class ClusterScoreWithRelationsDomain {
    readonly id?: number;
    readonly cycleId?: number | null;
    readonly clusterId: number;
    readonly rateeId: number;
    readonly reviewId: number;
    readonly score: Decimal;
    readonly answersCount: number;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    readonly cluster: ClusterDomain;
    readonly ratee: UserDomain;

    private constructor(props: ClusterScoreWithRelationsProps) {
        this.id = props.id;
        this.cycleId = props.cycleId ?? null;
        this.clusterId = props.clusterId;
        this.rateeId = props.rateeId;
        this.reviewId = props.reviewId;
        this.score = new Decimal(props.score);
        this.answersCount = props.answersCount;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.cluster = props.cluster;
        this.ratee = props.ratee;
    }

    static create(
        props: ClusterScoreWithRelationsProps,
    ): ClusterScoreWithRelationsDomain {
        return new ClusterScoreWithRelationsDomain(props);
    }
}
