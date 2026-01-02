export class Feedback360ReviewerRelationDomain {
  readonly id?: number;
  readonly feedback360Id: number;
  readonly userId: number;
  readonly createdAt?: Date;

  constructor(props: { id?: number; feedback360Id: number; userId: number; createdAt?: Date }) {
    this.id = props.id;
    this.feedback360Id = props.feedback360Id;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
  }
}


