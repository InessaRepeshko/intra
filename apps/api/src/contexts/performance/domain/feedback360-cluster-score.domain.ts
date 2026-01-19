export type Feedback360ClusterScoreProps = {
  id?: number;
  cycleId?: number | null;
  clusterId: number;
  userId: number;
  feedback360Id?: number | null;
  score: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Feedback360ClusterScoreDomain {
  readonly id?: number;
  readonly cycleId?: number | null;
  readonly clusterId: number;
  readonly userId: number;
  readonly feedback360Id?: number | null;
  readonly score: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: Feedback360ClusterScoreProps) {
    this.id = props.id;
    this.cycleId = props.cycleId ?? null;
    this.clusterId = props.clusterId;
    this.userId = props.userId;
    this.feedback360Id = props.feedback360Id ?? null;
    this.score = props.score;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Feedback360ClusterScoreProps): Feedback360ClusterScoreDomain {
    return new Feedback360ClusterScoreDomain(props);
  }
}
