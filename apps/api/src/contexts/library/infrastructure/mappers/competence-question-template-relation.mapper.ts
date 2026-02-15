import { CompetenceQuestionTemplateRelation as PrismaCompetenceQuestionTemplateRelation } from '@intra/database';
import { CompetenceQuestionTemplateRelationDomain } from '../../domain/competence-question-template-relation.domain';

export class CompetenceQuestionTemplateRelationMapper {
    static toDomain(
        relation: PrismaCompetenceQuestionTemplateRelation,
    ): CompetenceQuestionTemplateRelationDomain {
        return CompetenceQuestionTemplateRelationDomain.create({
            id: relation.id,
            competenceId: relation.competenceId,
            questionTemplateId: relation.questionTemplateId,
            createdAt: relation.createdAt,
        });
    }
}
