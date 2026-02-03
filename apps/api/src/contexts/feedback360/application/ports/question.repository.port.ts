import { QuestionSearchQuery } from '@intra/shared-kernel';
import { QuestionDomain } from '../../domain/question.domain';

export const QUESTION_REPOSITORY = Symbol('FEEDBACK360.QUESTION_REPOSITORY');

export interface QuestionRepositoryPort {
    create(question: QuestionDomain): Promise<QuestionDomain>;
    findById(id: number): Promise<QuestionDomain | null>;
    search(query: QuestionSearchQuery): Promise<QuestionDomain[]>;
    deleteById(id: number): Promise<void>;
}
