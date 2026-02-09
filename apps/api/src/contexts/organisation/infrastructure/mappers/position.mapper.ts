import { Position } from '@intra/database';
import { PositionDomain } from '../../domain/position.domain';

export class PositionMapper {
    static toDomain(position: Position): PositionDomain {
        return PositionDomain.create({
            id: position.id,
            title: position.title,
            description: position.description,
            createdAt: position.createdAt,
            updatedAt: position.updatedAt,
        });
    }
}
