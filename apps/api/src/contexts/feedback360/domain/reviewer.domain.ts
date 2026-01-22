export type ReviewerProps = {
  id?: number;
  reviewId: number;
  reviewerId: number;
  positionId: number;
  positionTitle: string;
  createdAt?: Date;
};

export class ReviewerDomain {
  readonly id?: number;
  readonly reviewId: number;
  readonly reviewerId: number;
  readonly positionId: number;
  readonly positionTitle: string;
  readonly createdAt?: Date;

  private constructor(props: ReviewerProps) {
    this.id = props.id;
    this.reviewId = props.reviewId;
    this.reviewerId = props.reviewerId;
    this.positionId = props.positionId;
    this.positionTitle = props.positionTitle;
    this.createdAt = props.createdAt;
  }

  static create(props: ReviewerProps): ReviewerDomain {
    return new ReviewerDomain(props);
  }
}
