import { AnswerType } from 'src/contexts/library/domain/answer-type.enum';

export type Feedback360QuestionProps = {
  id?: number;
  cycleId?: number | null;
  questionId?: number | null;
  title: string;
  answerType: AnswerType;
  competenceId?: number | null;
  positionId?: number | null;
  isForSelfassessment?: boolean | null;
  createdAt?: Date;
};

export class Feedback360QuestionDomain {
  readonly id?: number;
  readonly cycleId?: number | null;
  readonly questionId?: number | null;
  readonly title: string;
  readonly answerType: AnswerType;
  readonly competenceId?: number | null;
  readonly positionId?: number | null;
  readonly isForSelfassessment: boolean;
  readonly createdAt?: Date;

  private constructor(props: Feedback360QuestionProps) {
    this.id = props.id;
    this.cycleId = props.cycleId ?? null;
    this.questionId = props.questionId ?? null;
    this.title = props.title;
    this.answerType = props.answerType;
    this.competenceId = props.competenceId ?? null;
    this.positionId = props.positionId ?? null;
    this.isForSelfassessment = props.isForSelfassessment ?? false;
    this.createdAt = props.createdAt;
  }

  static create(props: Feedback360QuestionProps): Feedback360QuestionDomain {
    return new Feedback360QuestionDomain(props);
  }
}
