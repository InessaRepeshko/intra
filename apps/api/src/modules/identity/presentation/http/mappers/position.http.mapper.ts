import { PositionDomain } from '../../../domain/position/position.domain';
import { Position } from '../models/position.entity';

export class PositionHttpMapper {
  static fromDomain(domain: PositionDomain): Position {
    const entity = new Position();
    Object.assign(entity, {
      id: domain.id,
      title: domain.title,
      description: domain.description,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
    return entity;
  }
}


