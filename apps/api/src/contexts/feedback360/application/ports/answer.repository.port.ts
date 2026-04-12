import { AnswerSearchQuery, RespondentCategory } from '@intra/shared-kernel';
import { AnswerDomain } from '../../domain/answer.domain';

export const ANSWER_REPOSITORY = Symbol('FEEDBACK360.ANSWER_REPOSITORY');

export interface AnswerRepositoryPort {
    create(answer: AnswerDomain): Promise<AnswerDomain>;
    list(query: AnswerSearchQuery): Promise<AnswerDomain[]>;
    findById(id: number): Promise<AnswerDomain | null>;
    getAnswersCountByRespondentCategories(
        reviewId: number,
    ): Promise<{ respondentCategory: RespondentCategory; answers: number }[]>;
    deleteById(id: number): Promise<void>;
}
