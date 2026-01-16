export type CompetenceQuestionPositionProps = {
  id?: number;
  questionId: number;
  positionId: number;
  createdAt?: Date;
};

export class CompetenceQuestionPositionDomain {
  readonly id?: number;
  readonly questionId: number;
  readonly positionId: number;
  readonly createdAt?: Date;

  private constructor(props: CompetenceQuestionPositionProps) {
    this.id = props.id;
    this.questionId = props.questionId;
    this.positionId = props.positionId;
    this.createdAt = props.createdAt;
  }

  static create(props: CompetenceQuestionPositionProps): CompetenceQuestionPositionDomain {
    return new CompetenceQuestionPositionDomain(props);
  }
}

