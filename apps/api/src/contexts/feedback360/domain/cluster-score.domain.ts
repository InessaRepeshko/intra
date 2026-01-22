export type ClusterScoreProps = {
  id?: number;
  cycleId?: number | null;
  clusterId: number;
  rateeId: number;
  reviewId?: number | null;
  score: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class ClusterScoreDomain {
  readonly id?: number;
  readonly cycleId?: number | null;
  readonly clusterId: number;
  readonly rateeId: number;
  readonly reviewId?: number | null;
  readonly score: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: ClusterScoreProps) {
    this.id = props.id;
    this.cycleId = props.cycleId ?? null;
    this.clusterId = props.clusterId;
    this.rateeId = props.rateeId;
    this.reviewId = props.reviewId ?? null;
    this.score = props.score;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: ClusterScoreProps): ClusterScoreDomain {
    return new ClusterScoreDomain(props);
  }
}
