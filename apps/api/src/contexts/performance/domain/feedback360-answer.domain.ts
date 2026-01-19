import { AnswerType } from 'src/contexts/library/domain/answer-type.enum';
import { RespondentCategory } from './respondent-category.enum';

export type Feedback360AnswerProps = {
  id?: number;
  feedback360Id: number;
  questionId: number;
  feedback360QuestionId?: number | null;
  respondentCategory: RespondentCategory;
  answerType: AnswerType;
  numericalValue?: number | null;
  textValue?: string | null;
  createdAt?: Date;
};

export class Feedback360AnswerDomain {
  readonly id?: number;
  readonly feedback360Id: number;
  readonly questionId: number;
  readonly feedback360QuestionId?: number | null;
  readonly respondentCategory: RespondentCategory;
  readonly answerType: AnswerType;
  readonly numericalValue?: number | null;
  readonly textValue?: string | null;
  readonly createdAt?: Date;

  private constructor(props: Feedback360AnswerProps) {
    this.id = props.id;
    this.feedback360Id = props.feedback360Id;
    this.questionId = props.questionId;
    this.feedback360QuestionId = props.feedback360QuestionId ?? null;
    this.respondentCategory = props.respondentCategory;
    this.answerType = props.answerType;
    this.numericalValue = props.numericalValue ?? null;
    this.textValue = props.textValue ?? null;
    this.createdAt = props.createdAt;
  }

  static create(props: Feedback360AnswerProps): Feedback360AnswerDomain {
    return new Feedback360AnswerDomain(props);
  }
}
