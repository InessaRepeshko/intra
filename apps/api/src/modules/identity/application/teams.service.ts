import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from '../presentation/http/dto/create-team.dto';
import { UpdateTeamDto } from '../presentation/http/dto/update-team.dto';
import { TeamsRepository } from '../infrastructure/prisma-repositories/teams.repository';
import { Team } from '../presentation/http/models/team.entity';
import { TeamMapper } from '../domain/team/team.mapper';

@Injectable()
export class TeamsService {
  constructor(private readonly teamsRepo: TeamsRepository) {}

  async create(dto: CreateTeamDto): Promise<Team> {
    const team = TeamMapper.fromCreateDto(dto);
    return await this.teamsRepo.create(TeamMapper.toPrismaCreate(team));
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
    return await this.teamsRepo.findByHeadId(headId);
  }

  async findByMemberId(memberId: number): Promise<Team[]> {
    return await this.teamsRepo.findByMemberId(memberId);
  }

  async update(id: number, dto: UpdateTeamDto): Promise<Team> {
    await this.findOne(id);
    const patch = TeamMapper.fromUpdateDto(dto);
    return await this.teamsRepo.updateById(id, TeamMapper.toPrismaUpdate(patch));
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.teamsRepo.deleteById(id);
  }
}
