export type Feedback360ReviewerRelationProps = {
  id?: number;
  feedback360Id: number;
  userId: number;
  createdAt?: Date;
};

export class Feedback360ReviewerRelationDomain {
  readonly id?: number;
  readonly feedback360Id: number;
  readonly userId: number;
  readonly createdAt?: Date;

  private constructor(props: Feedback360ReviewerRelationProps) {
    this.id = props.id;
    this.feedback360Id = props.feedback360Id;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
  }

  static create(props: Feedback360ReviewerRelationProps): Feedback360ReviewerRelationDomain {
    return new Feedback360ReviewerRelationDomain(props);
  }
}
