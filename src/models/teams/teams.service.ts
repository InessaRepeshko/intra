import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsRepository } from './teams.repository';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {
  constructor(private readonly teamsRepo: TeamsRepository) {}

  async create(dto: CreateTeamDto): Promise<Team> {
    return await this.teamsRepo.create(dto);
  }

  async findAll(): Promise<Team[]> {
    return await this.teamsRepo.findAll();
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamsRepo.findById(id);
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }
  async findByHeadId(headId: number): Promise<Team[]> {
    const teams = await this.teamsRepo.findByHeadId(headId);
    if (!teams || teams.length === 0) throw new NotFoundException('Teams not found');
    return teams;
  }

  async findByMemberId(memberId: number): Promise<Team[]> {
    const teams = await this.teamsRepo.findByMemberId(memberId);
    if (!teams || teams.length === 0) throw new NotFoundException('Teams not found');
    return teams;
  }

  async update(id: number, dto: UpdateTeamDto): Promise<Team> {
    await this.findOne(id);
    return await this.teamsRepo.updateById(id, dto);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.teamsRepo.deleteById(id);
  }
}
