import { Inject, Injectable } from '@nestjs/common';
import { TeamsRepository } from '../../domain/repositories/teams.repository';
import { TEAMS_REPOSITORY } from '../../domain/repositories/teams.repository.token';
import { UpdateTeamRequest } from './update-team.request';
import { TeamNotFoundError } from '../../domain/errors/team-not-found.error';
import { UpdateTeamData, Team } from '../../domain/model/team';

@Injectable()
export class UpdateTeamUseCase {
  constructor(@Inject(TEAMS_REPOSITORY) private readonly teamsRepo: TeamsRepository) {}

  async execute(teamId: number, req: UpdateTeamRequest): Promise<Team> {
    const existing = await this.teamsRepo.findById(teamId);
    if (!existing) throw new TeamNotFoundError(teamId);

    const patch: UpdateTeamData = {
      ...(req.title !== undefined ? { title: req.title } : {}),
      ...(req.description !== undefined ? { description: req.description } : {}),
      ...(req.headId !== undefined ? { headId: req.headId } : {}),
    };

    return this.teamsRepo.updateById(teamId, patch);
  }
}


