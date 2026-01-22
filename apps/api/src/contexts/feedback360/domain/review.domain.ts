import { ReviewStage } from '@intra/shared-kernel';

export type ReviewProps = {
  id?: number;
  rateeId: number;
  rateePositionId: number;
  rateePositionTitle: string;
  hrId: number;
  hrNote?: string | null;
  teamId?: number | null;
  teamTitle?: string | null;
  managerId?: number | null;
  cycleId?: number | null;
  stage?: ReviewStage;
  createdAt?: Date;
  updatedAt?: Date;
};

export class ReviewDomain {
  readonly id?: number;
  readonly rateeId: number;
  readonly rateePositionId: number;
  readonly rateePositionTitle: string;
  readonly hrId: number;
  readonly hrNote?: string | null;
  readonly teamId?: number | null;
  readonly teamTitle?: string | null;
  readonly managerId?: number | null;
  readonly cycleId?: number | null;
  readonly stage: ReviewStage;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: ReviewProps) {
    this.id = props.id;
    this.rateeId = props.rateeId;
    this.rateePositionId = props.rateePositionId;
    this.rateePositionTitle = props.rateePositionTitle;
    this.hrId = props.hrId;
    this.hrNote = props.hrNote ?? null;
    this.teamId = props.teamId ?? null;
    this.teamTitle = props.teamTitle ?? null;
    this.managerId = props.managerId ?? null;
    this.cycleId = props.cycleId ?? null;
    this.stage = props.stage ?? ReviewStage.VERIFICATION_BY_HR;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: ReviewProps): ReviewDomain {
    return new ReviewDomain(props);
  }
}
