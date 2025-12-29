import { Inject, Injectable } from '@nestjs/common';
import { TeamsRepository } from '../domain/repositories/teams.repository';
import { TEAMS_REPOSITORY } from '../domain/repositories/teams.repository.token';
import { Team } from '../domain/model/team';
import { TeamNotFoundError } from '../domain/errors/team-not-found.error';
import { CreateTeamRequest } from './use-cases/create-team.request';
import { UpdateTeamRequest } from './use-cases/update-team.request';
import { CreateTeamUseCase } from './use-cases/create-team.usecase';
import { UpdateTeamUseCase } from './use-cases/update-team.usecase';

@Injectable()
export class TeamsApplicationService {
  constructor(
    private readonly createTeam: CreateTeamUseCase,
    private readonly updateTeam: UpdateTeamUseCase,
    @Inject(TEAMS_REPOSITORY) private readonly teamsRepo: TeamsRepository,
  ) {}

  async create(req: CreateTeamRequest): Promise<Team> {
    return this.createTeam.execute(req);
  }

  async findAll(): Promise<Team[]> {
    return this.teamsRepo.findAll();
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamsRepo.findById(id);
    if (!team) throw new TeamNotFoundError(id);
    return team;
  }

  async findByHeadId(headId: number): Promise<Team[]> {
    return this.teamsRepo.findByHeadId(headId);
  }

  async findByMemberId(memberId: number): Promise<Team[]> {
    return this.teamsRepo.findByMemberId(memberId);
  }

  async update(id: number, req: UpdateTeamRequest): Promise<Team> {
    return this.updateTeam.execute(id, req);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.teamsRepo.deleteById(id);
  }
}


