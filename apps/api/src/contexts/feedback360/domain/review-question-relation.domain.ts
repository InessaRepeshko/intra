import { AnswerType } from '@intra/shared-kernel';

export type ReviewQuestionRelationProps = {
  id?: number;
  reviewId: number;
  libraryQuestionId: number;
  questionTitle: string;
  answerType: AnswerType;
  competenceId: number;
  isForSelfassessment?: boolean | null;
  createdAt?: Date;
};

export class ReviewQuestionRelationDomain {
  readonly id?: number;
  readonly reviewId: number;
  readonly libraryQuestionId: number;
  readonly questionTitle: string;
  readonly answerType: AnswerType;
  readonly competenceId: number;
  readonly isForSelfassessment: boolean;
  readonly createdAt?: Date;

  private constructor(props: ReviewQuestionRelationProps) {
    this.id = props.id;
    this.reviewId = props.reviewId;
    this.libraryQuestionId = props.libraryQuestionId;
    this.questionTitle = props.questionTitle;
    this.answerType = props.answerType;
    this.competenceId = props.competenceId;
    this.isForSelfassessment = props.isForSelfassessment ?? false;
    this.createdAt = props.createdAt;
  }

  static create(props: ReviewQuestionRelationProps): ReviewQuestionRelationDomain {
    return new ReviewQuestionRelationDomain(props);
  }
}
