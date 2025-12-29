import { Team as DomainTeam } from '../../../domain/model/team';
import { TeamResponse } from './team.response';

export class TeamResponseMapper {
  static toResponse(domain: DomainTeam): TeamResponse {
    const p = domain.toPrimitives();
    return Object.assign(new TeamResponse(), {
      id: p.id,
      title: p.title,
      description: p.description,
      headId: p.headId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }
}


