import { AnswerDomain } from '../../domain/answer.domain';
import { RespondentCategory } from '@intra/shared-kernel';

export const ANSWER_REPOSITORY = Symbol('FEEDBACK360.ANSWER_REPOSITORY');

export type AnswerSearchQuery = {
  reviewId?: number;
  respondentCategory?: RespondentCategory;
};

export interface AnswerRepositoryPort {
  create(answer: AnswerDomain): Promise<AnswerDomain>;
  list(query: AnswerSearchQuery): Promise<AnswerDomain[]>;
  deleteById(id: number): Promise<void>;
}
