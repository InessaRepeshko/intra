import { TeamDomain } from '../../../domain/entities/team.domain';
import { Team } from '../models/team.entity';
import { TeamWithRelations } from '../models/team-with-relations.entity';
import { UserHttpMapper } from './user.http.mapper';

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

  static fromDomainWithRelations(domain: TeamDomain): TeamWithRelations {
    const entity = new TeamWithRelations();
    Object.assign(entity, {
      id: domain.id,
      title: domain.title,
      description: domain.description,
      headId: domain.headId,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      head: domain.head ? UserHttpMapper.fromDomain(domain.head) : undefined,
      members: domain.members?.map((m) => UserHttpMapper.fromDomain(m)),
    });
    return entity;
  }
}

