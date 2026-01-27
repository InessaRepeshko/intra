import { AnswerDomain } from '../../domain/answer.domain';
import { AnswerSearchQuery } from '@intra/shared-kernel';

export const ANSWER_REPOSITORY = Symbol('FEEDBACK360.ANSWER_REPOSITORY');

export interface AnswerRepositoryPort {
  create(answer: AnswerDomain): Promise<AnswerDomain>;
  list(query: AnswerSearchQuery): Promise<AnswerDomain[]>;
  deleteById(id: number): Promise<void>;
}
