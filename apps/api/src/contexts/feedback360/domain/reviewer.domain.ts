export type ReviewerProps = {
  id?: number;
  reviewId: number;
  reviewerId: number;
  fullName: string;
  positionId: number;
  positionTitle: string;
  teamId?: number | null;
  teamTitle?: string | null;
  createdAt?: Date;
};

export class ReviewerDomain {
  readonly id?: number;
  readonly reviewId: number;
  readonly reviewerId: number;
  readonly fullName: string;
  readonly positionId: number;
  readonly positionTitle: string;
  readonly teamId?: number | null;
  readonly teamTitle?: string | null;
  readonly createdAt?: Date;

  private constructor(props: ReviewerProps) {
    this.id = props.id;
    this.reviewId = props.reviewId;
    this.reviewerId = props.reviewerId;
    this.fullName = props.fullName;
    this.positionId = props.positionId;
    this.positionTitle = props.positionTitle;
    this.teamId = props.teamId ?? null;
    this.teamTitle = props.teamTitle ?? null;

    this.createdAt = props.createdAt;
  }

  static create(props: ReviewerProps): ReviewerDomain {
    return new ReviewerDomain(props);
  }
}
