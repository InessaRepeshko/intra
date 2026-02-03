import { CompetenceQuestionTemplateRelationDomain } from '../../domain/competence-question-template-relation.domain';

export const COMPETENCE_QUESTION_TEMPLATE_RELATION_REPOSITORY = Symbol(
    'LIBRARY.COMPETENCE_QUESTION_TEMPLATE_RELATION_REPOSITORY',
);

export interface CompetenceQuestionTemplateRelationRepositoryPort {
    link(
        competenceId: number,
        questionTemplateId: number,
    ): Promise<CompetenceQuestionTemplateRelationDomain>;
    unlink(competenceId: number, questionTemplateId: number): Promise<void>;
    listByCompetence(
        competenceId: number,
    ): Promise<CompetenceQuestionTemplateRelationDomain[]>;
    listByQuestionTemplate(
        questionTemplateId: number,
    ): Promise<CompetenceQuestionTemplateRelationDomain[]>;
    replaceForCompetence(
        competenceId: number,
        questionTemplateIds: number[],
    ): Promise<CompetenceQuestionTemplateRelationDomain[]>;
}
