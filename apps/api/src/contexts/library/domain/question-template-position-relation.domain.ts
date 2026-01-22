export type QuestionTemplatePositionRelationProps = {
  id?: number;
  questionTemplateId: number;
  positionId: number;
  createdAt?: Date;
};

export class QuestionTemplatePositionRelationDomain {
  readonly id?: number;
  readonly questionTemplateId: number;
  readonly positionId: number;
  readonly createdAt?: Date;

  private constructor(props: QuestionTemplatePositionRelationProps) {
    this.id = props.id;
    this.questionTemplateId = props.questionTemplateId;
    this.positionId = props.positionId;
    this.createdAt = props.createdAt;
  }

  static create(props: QuestionTemplatePositionRelationProps): QuestionTemplatePositionRelationDomain {
    return new QuestionTemplatePositionRelationDomain(props);
  }
}

