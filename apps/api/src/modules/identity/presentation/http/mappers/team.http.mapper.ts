import { TeamDomain } from '../../../domain/team/team.domain';
import { Team } from '../models/team.entity';

export class TeamHttpMapper {
  static fromDomain(domain: TeamDomain): Team {
    const entity = new Team();
    Object.assign(entity, {
      id: domain.id,
      title: domain.title,
      description: domain.description,
      headId: domain.headId,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
    return entity;
  }
}


