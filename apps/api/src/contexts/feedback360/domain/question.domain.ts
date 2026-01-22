import { AnswerType } from  '@intra/shared-kernel';

export type QuestionProps = {
  id?: number;
  cycleId?: number | null;
  questionTemplateId?: number | null;
  title: string;
  answerType: AnswerType;
  competenceId?: number | null;
  isForSelfassessment?: boolean | null;
  createdAt?: Date;
};

export class QuestionDomain {
  readonly id?: number;
  readonly cycleId?: number | null;
  readonly questionTemplateId?: number | null;
  readonly title: string;
  readonly answerType: AnswerType;
  readonly competenceId?: number | null;
  readonly isForSelfassessment: boolean;
  readonly createdAt?: Date;

  private constructor(props: QuestionProps) {
    this.id = props.id;
    this.cycleId = props.cycleId ?? null;
    this.questionTemplateId = props.questionTemplateId ?? null;
    this.title = props.title;
    this.answerType = props.answerType;
    this.competenceId = props.competenceId ?? null;
    this.isForSelfassessment = props.isForSelfassessment ?? false;
    this.createdAt = props.createdAt;
  }

  static create(props: QuestionProps): QuestionDomain {
    return new QuestionDomain(props);
  }
}
