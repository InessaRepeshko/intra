import { UserHttpMapper } from 'src/contexts/identity/presentation/http/mappers/user.http.mapper';
import { TeamMembershipDomain } from '../../../domain/team-membership.domain';
import { TeamMemberResponse } from '../models/team-member.response';

export class TeamMembershipHttpMapper {
    static toResponse(domain: TeamMembershipDomain): TeamMemberResponse {
        const view = new TeamMemberResponse();
        view.id = domain.id!;
        view.teamId = domain.teamId;
        view.memberId = domain.memberId;
        view.isPrimary = domain.isPrimary;
        view.createdAt = domain.createdAt!;
        if (domain.user) {
            view.user = UserHttpMapper.toResponse(domain.user);
        }
        return view;
    }
}
