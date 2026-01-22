import { AnswerType } from  '@intra/shared-kernel';

export type QuestionProps = {
  id?: number;
  cycleId?: number | null;
  libraryQuestionId?: number | null;
  title: string;
  answerType: AnswerType;
  competenceId?: number | null;
  positionId?: number | null;
  isForSelfassessment?: boolean | null;
  createdAt?: Date;
};

export class QuestionDomain {
  readonly id?: number;
  readonly cycleId?: number | null;
  readonly libraryQuestionId?: number | null;
  readonly title: string;
  readonly answerType: AnswerType;
  readonly competenceId?: number | null;
  readonly positionId?: number | null;
  readonly isForSelfassessment: boolean;
  readonly createdAt?: Date;

  private constructor(props: QuestionProps) {
    this.id = props.id;
    this.cycleId = props.cycleId ?? null;
    this.libraryQuestionId = props.libraryQuestionId ?? null;
    this.title = props.title;
    this.answerType = props.answerType;
    this.competenceId = props.competenceId ?? null;
    this.positionId = props.positionId ?? null;
    this.isForSelfassessment = props.isForSelfassessment ?? false;
    this.createdAt = props.createdAt;
  }

  static create(props: QuestionProps): QuestionDomain {
    return new QuestionDomain(props);
  }
}
