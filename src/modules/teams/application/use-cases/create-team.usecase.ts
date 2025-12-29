import { Inject, Injectable } from '@nestjs/common';
import { TeamsRepository } from '../../domain/repositories/teams.repository';
import { TEAMS_REPOSITORY } from '../../domain/repositories/teams.repository.token';
import { CreateTeamRequest } from './create-team.request';
import { Team } from '../../domain/model/team';

@Injectable()
export class CreateTeamUseCase {
  constructor(@Inject(TEAMS_REPOSITORY) private readonly teamsRepo: TeamsRepository) {}

  async execute(req: CreateTeamRequest): Promise<Team> {
    return this.teamsRepo.create({
      title: req.title,
      description: req.description ?? null,
      headId: req.headId ?? null,
    });
  }
}


