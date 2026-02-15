import { PositionHierarchy } from '@intra/database';
import { PositionHierarchyDomain } from '../../domain/position-hierarchy.domain';

export class PositionHierarchyMapper {
    static toDomain(relation: PositionHierarchy): PositionHierarchyDomain {
        return PositionHierarchyDomain.create({
            id: relation.id,
            superiorPositionId: relation.superiorPositionId,
            subordinatePositionId: relation.subordinatePositionId,
            createdAt: relation.createdAt,
        });
    }
}
