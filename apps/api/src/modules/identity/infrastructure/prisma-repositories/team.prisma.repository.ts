import { Injectable } from '@nestjs/common';
import { Prisma, Team as PrismaTeam } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE } from 'src/common/constants/pagination.constants';
import { TeamRepositoryPort, TeamSearchQuery, TeamSearchResult } from '../../application/repository-ports/team.repository.port';
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

  async search(query: TeamSearchQuery = {}): Promise<TeamSearchResult> {
    const take = Math.min(query.take ?? PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE);
    const skip = query.skip ?? 0;

    const where: Prisma.TeamWhereInput = {
      ...(query.headId !== undefined ? { headId: query.headId } : {}),
      ...(query.title ? { title: { contains: query.title } } : {}),
      ...(query.description ? { description: { contains: query.description } } : {}),
      ...(query.memberId !== undefined ? { members: { some: { id: query.memberId } } } : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search } },
              { description: { contains: query.search } },
            ],
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      this.db.team.count({ where }),
      this.db.team.findMany({
        where,
        skip,
        take,
        orderBy: [{ title: 'asc' }, { id: 'asc' }],
      }),
    ]);

    const items = rows.map((t) => this.fromPrisma(t));
    return { items, count: items.length, total };
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


