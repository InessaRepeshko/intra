import { TeamMembership } from '@intra/database';
import { TeamMembershipDomain } from '../../domain/team-membership.domain';

export class TeamMembershipMapper {
    static toDomain(membership: TeamMembership): TeamMembershipDomain {
        return TeamMembershipDomain.create({
            id: membership.id,
            teamId: membership.teamId,
            memberId: membership.memberId,
            isPrimary: membership.isPrimary,
            createdAt: membership.createdAt,
        });
    }
}
