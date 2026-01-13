import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { TeamDomain } from '../../domain/team.domain';
import { TeamMembershipDomain } from '../../domain/team-membership.domain';
import type { TeamRepositoryPort } from '../ports/team.repository.port';
import {
  ORG_TEAM_REPOSITORY,
  TeamSearchQuery,
  TeamSearchResult,
  TeamUpdatePayload,
} from '../ports/team.repository.port';

export type CreateTeamCommand = {
  title: string;
  description?: string | null;
  headId?: number | null;
};

export type UpdateTeamCommand = Partial<CreateTeamCommand>;

export type AddTeamMemberCommand = {
  userId: number;
  isPrimary?: boolean | null;
};

@Injectable()
export class TeamService {
  constructor(
    @Inject(ORG_TEAM_REPOSITORY) private readonly teams: TeamRepositoryPort,
    private readonly identityUsers: IdentityUserService,
  ) {}

  async create(command: CreateTeamCommand): Promise<TeamDomain> {
    if (command.headId !== undefined && command.headId !== null) {
      await this.identityUsers.getById(command.headId);
    }

    const team = TeamDomain.create({
      title: command.title,
      description: command.description ?? null,
      headId: command.headId ?? null,
    });
    return this.teams.create(team);
  }

  async search(query: TeamSearchQuery): Promise<TeamSearchResult> {
    return this.teams.search(query);
  }

  async getById(id: number): Promise<TeamDomain> {
    const team = await this.teams.findById(id);
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async update(id: number, patch: UpdateTeamCommand): Promise<TeamDomain> {
    await this.getById(id);

    if (patch.headId !== undefined && patch.headId !== null) {
      await this.identityUsers.getById(patch.headId);
    }

    const payload: TeamUpdatePayload = {
      ...patch,
      ...(patch.description !== undefined ? { description: patch.description } : {}),
    };

    return this.teams.updateById(id, payload);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.teams.deleteById(id);
  }

  async addMember(teamId: number, command: AddTeamMemberCommand, opts?: { withUser?: boolean }): Promise<TeamMembershipDomain> {
    await this.getById(teamId);
    const user = await this.identityUsers.getById(command.userId);

    const membership = await this.teams.addMember(teamId, command.userId, command.isPrimary);
    if (opts?.withUser) {
      return membership.withUser(user);
    }
    return membership;
  }

  async removeMember(teamId: number, userId: number): Promise<void> {
    await this.getById(teamId);
    await this.teams.removeMember(teamId, userId);
  }

  async listMembers(teamId: number, opts?: { withUsers?: boolean }): Promise<TeamMembershipDomain[]> {
    await this.getById(teamId);
    const memberships = await this.teams.listMembers(teamId);

    if (!opts?.withUsers) return memberships;

    const withUsers = await Promise.all(
      memberships.map(async (membership) => {
        try {
          const user = await this.identityUsers.getById(membership.userId);
          return membership.withUser(user);
        } catch {
          return membership;
        }
      }),
    );

    return withUsers;
  }
}
