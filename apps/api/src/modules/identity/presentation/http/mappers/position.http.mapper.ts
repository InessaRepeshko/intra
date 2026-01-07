import { PositionDomain } from '../../../domain/position/position.domain';
import { Position } from '../models/position.entity';
import { PositionWithRelations } from '../models/position-with-relations.entity';
import { UserHttpMapper } from './user.http.mapper';

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

  static fromDomainWithRelations(domain: PositionDomain): PositionWithRelations {
    const entity = new PositionWithRelations();
    Object.assign(entity, {
      id: domain.id,
      title: domain.title,
      description: domain.description,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      users: domain.users?.map((u) => UserHttpMapper.fromDomain(u)),
    });
    return entity;
  }
}


