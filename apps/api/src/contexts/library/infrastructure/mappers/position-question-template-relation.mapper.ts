import { PositionQuestionTemplateRelation as PrismaPositionQuestionTemplateRelation } from '@intra/database';
import { PositionQuestionTemplateRelationDomain } from '../../domain/position-question-template-relation.domain';

export class PositionQuestionTemplateRelationMapper {
    static toDomain(
        relation: PrismaPositionQuestionTemplateRelation,
    ): PositionQuestionTemplateRelationDomain {
        return PositionQuestionTemplateRelationDomain.create({
            id: relation.id,
            questionTemplateId: relation.questionTemplateId,
            positionId: relation.positionId,
            createdAt: relation.createdAt,
        });
    }
}
