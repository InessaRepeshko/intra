import { PositionQuestionTemplateRelationDomain } from '../../domain/position-question-template-relation.domain';

export const POSITION_QUESTION_TEMPLATE_RELATION_REPOSITORY = Symbol(
    'LIBRARY.POSITION_QUESTION_TEMPLATE_RELATION_REPOSITORY',
);

export interface PositionQuestionTemplateRelationRepositoryPort {
    link(
        questionId: number,
        positionId: number,
    ): Promise<PositionQuestionTemplateRelationDomain>;
    unlink(questionId: number, positionId: number): Promise<void>;
    listByQuestion(
        questionId: number,
    ): Promise<PositionQuestionTemplateRelationDomain[]>;
    replace(
        questionId: number,
        positionIds: number[],
    ): Promise<PositionQuestionTemplateRelationDomain[]>;
}
