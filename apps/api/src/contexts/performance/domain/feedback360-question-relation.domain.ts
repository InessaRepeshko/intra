import { AnswerType } from 'src/contexts/library/domain/enums/answer-type.enum';

export type Feedback360QuestionRelationProps = {
  id?: number;
  feedback360Id: number;
  questionId: number;
  questionTitle: string;
  answerType: AnswerType;
  competenceId: number;
  isForSelfassessment?: boolean | null;
  createdAt?: Date;
};

export class Feedback360QuestionRelationDomain {
  readonly id?: number;
  readonly feedback360Id: number;
  readonly questionId: number;
  readonly questionTitle: string;
  readonly answerType: AnswerType;
  readonly competenceId: number;
  readonly isForSelfassessment: boolean;
  readonly createdAt?: Date;

  private constructor(props: Feedback360QuestionRelationProps) {
    this.id = props.id;
    this.feedback360Id = props.feedback360Id;
    this.questionId = props.questionId;
    this.questionTitle = props.questionTitle;
    this.answerType = props.answerType;
    this.competenceId = props.competenceId;
    this.isForSelfassessment = props.isForSelfassessment ?? false;
    this.createdAt = props.createdAt;
  }

  static create(props: Feedback360QuestionRelationProps): Feedback360QuestionRelationDomain {
    return new Feedback360QuestionRelationDomain(props);
  }
}
