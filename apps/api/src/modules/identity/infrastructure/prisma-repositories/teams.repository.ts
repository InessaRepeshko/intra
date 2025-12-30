import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Team } from '../../presentation/http/models/team.entity';

@Injectable()
export class TeamsRepository {
  constructor(private readonly db: PrismaService) {}

  async create(data: Prisma.TeamUncheckedCreateInput): Promise<Team> {
    return this.db.team.create({ data });
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

  async updateById(id: number, data: Prisma.TeamUncheckedUpdateInput): Promise<Team> {
    return this.db.team.update({ where: { id }, data });
  }

  async deleteById(id: number): Promise<Team> {
    return this.db.team.delete({ where: { id } });
  }
}


