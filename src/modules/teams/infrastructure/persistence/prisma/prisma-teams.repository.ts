import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/infrastructure/database/database.service';
import { TeamsRepository } from '../../../domain/repositories/teams.repository';
import { CreateTeamData, Team, UpdateTeamData } from '../../../domain/model/team';
import { PrismaTeamPersistenceMapper } from './prisma-team.persistence-mapper';

@Injectable()
export class PrismaTeamsRepository implements TeamsRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreateTeamData): Promise<Team> {
    const created = await this.db.team.create({ data: PrismaTeamPersistenceMapper.toPrismaCreate(data) });
    return PrismaTeamPersistenceMapper.toDomain(created);
  }

  async findAll(): Promise<Team[]> {
    const teams = await this.db.team.findMany();
    return teams.map(PrismaTeamPersistenceMapper.toDomain);
  }

  async findById(id: number): Promise<Team | null> {
    const team = await this.db.team.findUnique({ where: { id } });
    return team ? PrismaTeamPersistenceMapper.toDomain(team) : null;
  }

  async findByHeadId(headId: number): Promise<Team[]> {
    const teams = await this.db.team.findMany({ where: { headId } });
    return teams.map(PrismaTeamPersistenceMapper.toDomain);
  }

  async findByMemberId(memberId: number): Promise<Team[]> {
    const teams = await this.db.team.findMany({ where: { members: { some: { id: memberId } } } });
    return teams.map(PrismaTeamPersistenceMapper.toDomain);
  }

  async updateById(id: number, data: UpdateTeamData): Promise<Team> {
    const updated = await this.db.team.update({ where: { id }, data: PrismaTeamPersistenceMapper.toPrismaUpdate(data) });
    return PrismaTeamPersistenceMapper.toDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.db.team.delete({ where: { id } });
  }
}


