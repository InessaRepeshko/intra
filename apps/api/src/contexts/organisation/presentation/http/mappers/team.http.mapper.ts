import { TeamDomain } from '../../../domain/team.domain';
import { TeamResponse } from '../models/team.response';
import { TeamMembershipDomain } from '../../../domain/team-membership.domain';
import { TeamMemberResponse } from '../models/team-member.response';
import { UserHttpMapper } from 'src/contexts/identity/presentation/http/mappers/user.http.mapper';

export class TeamHttpMapper {
  static toResponse(domain: TeamDomain): TeamResponse {
    const view = new TeamResponse();
    view.id = domain.id!;
    view.title = domain.title;
    view.description = domain.description;
    view.headId = domain.headId;
    view.createdAt = domain.createdAt;
    view.updatedAt = domain.updatedAt;
    return view;
  }

  static toMemberResponse(domain: TeamMembershipDomain): TeamMemberResponse {
    const view = new TeamMemberResponse();
    view.id = domain.id!;
    view.teamId = domain.teamId;
    view.memberId = domain.memberId;
    view.isPrimary = domain.isPrimary;
    view.createdAt = domain.createdAt;
    if (domain.user) {
      view.user = UserHttpMapper.toResponse(domain.user);
    }
    return view;
  }
}
