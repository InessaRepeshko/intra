import {
    QuestionTemplateSearchQuery,
    UpdateQuestionTemplatePayload,
} from '@intra/shared-kernel';
import { QuestionTemplateDomain } from '../../domain/question-template.domain';

export const QUESTION_TEMPLATE_REPOSITORY = Symbol(
    'LIBRARY.QUESTION_TEMPLATE_REPOSITORY',
);

export interface QuestionTemplateRepositoryPort {
    create(question: QuestionTemplateDomain): Promise<QuestionTemplateDomain>;
    findById(id: number): Promise<QuestionTemplateDomain | null>;
    search(
        query: QuestionTemplateSearchQuery,
    ): Promise<QuestionTemplateDomain[]>;
    updateById(
        id: number,
        patch: UpdateQuestionTemplatePayload,
    ): Promise<QuestionTemplateDomain>;
    deleteById(id: number): Promise<void>;
}
