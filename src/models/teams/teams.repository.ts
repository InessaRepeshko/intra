import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(data: Partial<Team>): Promise<Team> {
    return this.db.team.create({ data: data as Prisma.TeamCreateInput });
  }

  async findAll(): Promise<Team[]> {
    return this.db.team.findMany();
  }

  async findById(id: number): Promise<Team | null> {
    return this.db.team.findUnique({ where: { id } });
  }

  async findByHeadId(headId: number): Promise<Team[]> {
    return this.db.team.findMany({ where: { headId } });
  }

  async findByMemberId(memberId: number): Promise<Team[]> {
    return this.db.team.findMany({ where: { members: { some: { id: memberId } } } });
  }

  async updateById(id: number, data: Partial<Team>): Promise<Team> {
    return this.db.team.update({ where: { id }, data: data as Prisma.TeamUpdateInput });
  }

  async deleteById(id: number): Promise<Team> {
    return this.db.team.delete({ where: { id } });
  }
}


