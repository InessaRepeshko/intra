import { AnswerType } from '@intra/shared-kernel';
import { SortDirection } from '@intra/shared-kernel';
import { ReviewQuestionRelationDomain } from '../../domain/review-question-relation.domain';
import { ReviewQuestionRelationQueryDto } from '../../presentation/http/dto/review-question-relations/review-question-relation-query.dto';

export const REVIEW_QUESTION_RELATION_REPOSITORY = Symbol('FEEDBACK360.REVIEW_QUESTION_RELATION_REPOSITORY');

export enum ReviewQuestionRelationSortField {
  ID = 'id',
  REVIEW_ID = 'reviewId',
  QUESTION_ID = 'questionId',
  QUESTION_TITLE = 'questionTitle',
  ANSWER_TYPE = 'answerType',
  COMPETENCE_ID = 'competenceId',
  COMPETENCE_TITLE = 'competenceTitle',
  IS_FOR_SELFASSESSMENT = 'isForSelfassessment',
  CREATED_AT = 'createdAt',
}

export type ReviewQuestionRelationSearchQuery = {
  reviewId?: number;
  questionId?: number;
  questionTitle?: string;
  answerType?: AnswerType;
  competenceId?: number;
  competenceTitle?: string;
  isForSelfassessment?: boolean;
  sortBy?: ReviewQuestionRelationSortField;
  sortDirection?: SortDirection
};

export interface ReviewQuestionRelationRepositoryPort {
  link(relation: ReviewQuestionRelationDomain): Promise<ReviewQuestionRelationDomain>;
  listByReview(reviewId: number, query: ReviewQuestionRelationSearchQuery): Promise<ReviewQuestionRelationDomain[]>;
  unlink(reviewId: number, questionId: number): Promise<void>;
}
