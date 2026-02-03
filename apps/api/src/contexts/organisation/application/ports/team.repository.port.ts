import { TeamSearchQuery, UpdateTeamPayload } from '@intra/shared-kernel';
import { TeamMembershipDomain } from '../../domain/team-membership.domain';
import { TeamDomain } from '../../domain/team.domain';

export const ORGANISATION_TEAM_REPOSITORY = Symbol(
    'ORGANISATION.TEAM_REPOSITORY',
);

export interface TeamRepositoryPort {
    create(team: TeamDomain): Promise<TeamDomain>;
    findById(id: number): Promise<TeamDomain | null>;
    search(query: TeamSearchQuery): Promise<TeamDomain[]>;
    updateById(id: number, patch: UpdateTeamPayload): Promise<TeamDomain>;
    deleteById(id: number): Promise<void>;
    addMember(
        teamId: number,
        memberId: number,
        isPrimary?: boolean | null,
    ): Promise<TeamMembershipDomain>;
    removeMember(teamId: number, memberId: number): Promise<void>;
    listMembers(teamId: number): Promise<TeamMembershipDomain[]>;
}
