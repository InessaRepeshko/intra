import {
    AddTeamMemberPayload,
    CreateTeamPayload,
    TeamSearchQuery,
    UpdateTeamPayload,
} from '@intra/shared-kernel';
import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { TeamMembershipDomain } from '../../domain/team-membership.domain';
import { TeamDomain } from '../../domain/team.domain';
import type { TeamRepositoryPort } from '../ports/team.repository.port';
import { ORGANISATION_TEAM_REPOSITORY } from '../ports/team.repository.port';

@Injectable()
export class TeamService {
    constructor(
        @Inject(ORGANISATION_TEAM_REPOSITORY)
        private readonly teams: TeamRepositoryPort,
        private readonly identityUsers: IdentityUserService,
    ) {}

    async create(payload: CreateTeamPayload): Promise<TeamDomain> {
        if (payload.headId !== undefined && payload.headId !== null) {
            await this.identityUsers.getById(payload.headId);
        }

        const team = TeamDomain.create({
            title: payload.title,
            description: payload.description ?? null,
            headId: payload.headId ?? null,
        });
        return this.teams.create(team);
    }

    async search(query: TeamSearchQuery): Promise<TeamDomain[]> {
        return this.teams.search(query);
    }

    async getById(id: number): Promise<TeamDomain> {
        const team = await this.teams.findById(id);
        if (!team) throw new NotFoundException('Team not found');
        return team;
    }

    async update(id: number, patch: UpdateTeamPayload): Promise<TeamDomain> {
        await this.getById(id);

        if (patch.headId !== undefined && patch.headId !== null) {
            await this.identityUsers.getById(patch.headId);
        }

        const payload: UpdateTeamPayload = {
            ...patch,
            ...(patch.description !== undefined
                ? { description: patch.description }
                : {}),
        };

        return this.teams.updateById(id, payload);
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        const members = await this.listMembers(id);
        if (members.length > 0) {
            throw new BadRequestException(
                'Team #' +
                    id +
                    ' cannot be deleted. It has ' +
                    members.length +
                    ' members assigned to it.',
            );
        }
        await this.teams.deleteById(id);
    }

    async addMember(
        teamId: number,
        payload: AddTeamMemberPayload,
        opts?: { withUser?: boolean },
    ): Promise<TeamMembershipDomain> {
        await this.getById(teamId);
        const user = await this.identityUsers.getById(payload.memberId);

        const membership = await this.teams.addMember(
            teamId,
            payload.memberId,
            payload.isPrimary,
        );
        if (opts?.withUser) {
            return membership.withUser(user);
        }
        return membership;
    }

    async removeMember(teamId: number, memberId: number): Promise<void> {
        await this.getById(teamId);
        await this.teams.removeMember(teamId, memberId);
    }

    async listMembers(
        teamId: number,
        opts?: { withUsers?: boolean },
    ): Promise<TeamMembershipDomain[]> {
        await this.getById(teamId);
        const memberships = await this.teams.listMembers(teamId);

        if (!opts?.withUsers) return memberships;

        const withUsers = await Promise.all(
            memberships.map(async (membership) => {
                try {
                    const user = await this.identityUsers.getById(
                        membership.memberId,
                    );
                    return membership.withUser(user);
                } catch {
                    return membership;
                }
            }),
        );

        return withUsers;
    }
}
