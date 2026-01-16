export type QuestionPositionProps = {
  id?: number;
  questionId: number;
  positionId: number;
  createdAt?: Date;
};

export class QuestionPositionDomain {
  readonly id?: number;
  readonly questionId: number;
  readonly positionId: number;
  readonly createdAt?: Date;

  private constructor(props: QuestionPositionProps) {
    this.id = props.id;
    this.questionId = props.questionId;
    this.positionId = props.positionId;
    this.createdAt = props.createdAt;
  }

  static create(props: QuestionPositionProps): QuestionPositionDomain {
    return new QuestionPositionDomain(props);
  }
}

