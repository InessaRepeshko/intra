import { PositionCompetenceRelation as PrismaPositionCompetenceRelation } from '@intra/database';
import { PositionCompetenceRelationDomain } from '../../domain/position-competence-relation.domain';

export class PositionCompetenceRelationMapper {
    static toDomain(
        relation: PrismaPositionCompetenceRelation,
    ): PositionCompetenceRelationDomain {
        return PositionCompetenceRelationDomain.create({
            id: relation.id,
            positionId: relation.positionId,
            competenceId: relation.competenceId,
            createdAt: relation.createdAt,
        });
    }
}
