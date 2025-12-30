import { Injectable } from '@nestjs/common';
import { Prisma, Team as PrismaTeam } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeamRepositoryPort } from '../../application/repository-ports/team.repository.port';
import { TeamDomain } from '../../domain/team/team.domain';

@Injectable()
export class TeamPrismaRepository implements TeamRepositoryPort {
  constructor(private readonly db: PrismaService) {}

  async create(team: TeamDomain): Promise<TeamDomain> {
    const created = await this.db.team.create({ data: this.toPrismaCreate(team) });
    return this.fromPrisma(created);
  }

  async findAll(): Promise<TeamDomain[]> {
    const rows = await this.db.team.findMany();
    return rows.map((t) => this.fromPrisma(t));
  }

  async findById(id: number): Promise<TeamDomain | null> {
    const row = await this.db.team.findUnique({ where: { id } });
    return row ? this.fromPrisma(row) : null;
  }

  async findByHeadId(headId: number): Promise<TeamDomain[]> {
    const rows = await this.db.team.findMany({ where: { headId } });
    return rows.map((t) => this.fromPrisma(t));
  }

  async findByMemberId(memberId: number): Promise<TeamDomain[]> {
    const rows = await this.db.team.findMany({ where: { members: { some: { id: memberId } } } });
    return rows.map((t) => this.fromPrisma(t));
  }

  async updateById(id: number, patch: Partial<TeamDomain>): Promise<TeamDomain> {
    const updated = await this.db.team.update({ where: { id }, data: this.toPrismaUpdate(patch) });
    return this.fromPrisma(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.db.team.delete({ where: { id } });
  }

  private fromPrisma(row: PrismaTeam): TeamDomain {
    return new TeamDomain({
      id: row.id,
      title: row.title,
      description: row.description,
      headId: row.headId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toPrismaCreate(domain: TeamDomain): Prisma.TeamUncheckedCreateInput {
    return {
      title: domain.title,
      description: domain.description,
      headId: domain.headId,
    };
  }

  private toPrismaUpdate(domain: Partial<TeamDomain>): Prisma.TeamUncheckedUpdateInput {
    return {
      ...(domain.title !== undefined ? { title: domain.title } : {}),
      ...(domain.description !== undefined ? { description: domain.description } : {}),
      ...(domain.headId !== undefined ? { headId: domain.headId } : {}),
    };
  }
}


