export type CompetenceQuestionTemplateRelationProps = {
  id?: number;
  competenceId: number;
  questionTemplateId: number;
  createdAt?: Date;
};

export class CompetenceQuestionTemplateRelationDomain {
  readonly id?: number;
  readonly competenceId: number;
  readonly questionTemplateId: number;
  readonly createdAt?: Date;

  private constructor(props: CompetenceQuestionTemplateRelationProps) {
    this.id = props.id;
    this.competenceId = props.competenceId;
    this.questionTemplateId = props.questionTemplateId;
    this.createdAt = props.createdAt;
  }

  static create(props: CompetenceQuestionTemplateRelationProps): CompetenceQuestionTemplateRelationDomain {
    return new CompetenceQuestionTemplateRelationDomain(props);
  }
}
