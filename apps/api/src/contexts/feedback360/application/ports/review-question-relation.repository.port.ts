import { ReviewQuestionRelationDomain } from '../../domain/review-question-relation.domain';

export const REVIEW_QUESTION_RELATION_REPOSITORY = Symbol('FEEDBACK360.REVIEW_QUESTION_RELATION_REPOSITORY');

export interface ReviewQuestionRelationRepositoryPort {
  link(relation: ReviewQuestionRelationDomain): Promise<ReviewQuestionRelationDomain>;
  listByReview(reviewId: number): Promise<ReviewQuestionRelationDomain[]>;
  unlink(reviewId: number, questionId: number): Promise<void>;
}
