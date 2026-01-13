import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TEAM_REPOSITORY, TeamRepositoryPort, TeamSearchQuery, TeamSearchResult } from '../../domain/repositories/team.repository.port';
import { ORG_USER_REPOSITORY, OrgUserRepositoryPort } from '../../domain/repositories/user.repository.port';
import { TeamDomain } from '../../domain/entities/team.domain';

export type CreateTeamInput = {
  title: string;
  description?: string | null;
  headId?: number | null;
};

export type UpdateTeamInput = {
  title?: string;
  description?: string | null;
  headId?: number | null;
};

@Injectable()
export class TeamsService {
  constructor(
    @Inject(TEAM_REPOSITORY) private readonly teamsRepo: TeamRepositoryPort,
    @Inject(ORG_USER_REPOSITORY) private readonly usersRepo: OrgUserRepositoryPort,
  ) {}

  async create(input: CreateTeamInput): Promise<TeamDomain> {
    const headId = input.headId ?? null;
    if (headId !== null) await this.ensureUserExists(headId);

    const team = new TeamDomain({
      title: input.title,
      description: input.description ?? null,
      headId,
    });

    return this.teamsRepo.create(team);
  }

  async findAll(): Promise<TeamDomain[]> {
    return this.teamsRepo.findAll();
  }

  async search(query?: TeamSearchQuery): Promise<TeamSearchResult> {
    return this.teamsRepo.search(query);
  }

  async findOne(id: number): Promise<TeamDomain> {
    const team = await this.teamsRepo.findById(id);
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async findOneWithRelations(id: number): Promise<TeamDomain> {
    const team = await this.teamsRepo.findByIdWithRelations(id);
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async update(id: number, patch: UpdateTeamInput): Promise<TeamDomain> {
    await this.findOne(id);
    if (patch.headId !== undefined && patch.headId !== null) await this.ensureUserExists(patch.headId);

    return this.teamsRepo.updateById(id, patch);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.teamsRepo.deleteById(id);
  }

  private async ensureUserExists(userId: number): Promise<void> {
    const user = await this.usersRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
  }
}

