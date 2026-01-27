import { ReviewQuestionRelationDomain } from '../../domain/review-question-relation.domain';
import { ReviewQuestionRelationSearchQuery } from '@intra/shared-kernel';

export const REVIEW_QUESTION_RELATION_REPOSITORY = Symbol('FEEDBACK360.REVIEW_QUESTION_RELATION_REPOSITORY');

export interface ReviewQuestionRelationRepositoryPort {
  link(relation: ReviewQuestionRelationDomain): Promise<ReviewQuestionRelationDomain>;
  listByReview(reviewId: number, query: ReviewQuestionRelationSearchQuery): Promise<ReviewQuestionRelationDomain[]>;
  unlink(reviewId: number, questionId: number): Promise<void>;
}
