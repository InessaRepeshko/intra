import { ReviewStage } from '@intra/shared-kernel';

export type ReviewProps = {
  id?: number;
  rateeId: number;
  rateeNote?: string | null;
  positionId: number;
  hrId: number;
  hrNote?: string | null;
  cycleId?: number | null;
  stage?: ReviewStage;
  createdAt?: Date;
  updatedAt?: Date;
};

export class ReviewDomain {
  readonly id?: number;
  readonly rateeId: number;
  readonly rateeNote?: string | null;
  readonly positionId: number;
  readonly hrId: number;
  readonly hrNote?: string | null;
  readonly cycleId?: number | null;
  readonly stage: ReviewStage;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: ReviewProps) {
    this.id = props.id;
    this.rateeId = props.rateeId;
    this.rateeNote = props.rateeNote ?? null;
    this.positionId = props.positionId;
    this.hrId = props.hrId;
    this.hrNote = props.hrNote ?? null;
    this.cycleId = props.cycleId ?? null;
    this.stage = props.stage ?? ReviewStage.VERIFICATION_BY_HR;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: ReviewProps): ReviewDomain {
    return new ReviewDomain(props);
  }
}
