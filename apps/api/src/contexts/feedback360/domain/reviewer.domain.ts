export type ReviewerProps = {
  id?: number;
  reviewId: number;
  userId: number;
  createdAt?: Date;
};

export class ReviewerDomain {
  readonly id?: number;
  readonly reviewId: number;
  readonly userId: number;
  readonly createdAt?: Date;

  private constructor(props: ReviewerProps) {
    this.id = props.id;
    this.reviewId = props.reviewId;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
  }

  static create(props: ReviewerProps): ReviewerDomain {
    return new ReviewerDomain(props);
  }
}
