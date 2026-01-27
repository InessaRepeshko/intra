import { QuestionDomain } from '../../domain/question.domain';
import { QuestionSearchQuery } from '@intra/shared-kernel';

export const QUESTION_REPOSITORY = Symbol('FEEDBACK360.QUESTION_REPOSITORY');

export interface QuestionRepositoryPort {
  create(question: QuestionDomain): Promise<QuestionDomain>;
  findById(id: number): Promise<QuestionDomain | null>;
  search(query: QuestionSearchQuery): Promise<QuestionDomain[]>;
  deleteById(id: number): Promise<void>;
}
