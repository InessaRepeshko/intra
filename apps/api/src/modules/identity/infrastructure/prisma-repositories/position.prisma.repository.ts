import { Injectable } from '@nestjs/common';
import { Position as PrismaPosition, Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import type { PositionRepositoryPort } from '../../application/repository-ports/position.repository.port';
import { PositionDomain } from '../../domain/position/position.domain';

@Injectable()
export class PositionPrismaRepository implements PositionRepositoryPort {
  constructor(private readonly db: PrismaService) {}

  async create(position: PositionDomain): Promise<PositionDomain> {
    const created = await this.db.position.create({ data: this.toPrismaCreate(position) });
    return this.fromPrisma(created);
  }

  async findAll(): Promise<PositionDomain[]> {
    const rows = await this.db.position.findMany();
    return rows.map((p) => this.fromPrisma(p));
  }

  async findById(id: number): Promise<PositionDomain | null> {
    const row = await this.db.position.findUnique({ where: { id } });
    return row ? this.fromPrisma(row) : null;
  }

  async updateById(id: number, patch: Partial<PositionDomain>): Promise<PositionDomain> {
    const updated = await this.db.position.update({ where: { id }, data: this.toPrismaUpdate(patch) });
    return this.fromPrisma(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.db.position.delete({ where: { id } });
  }

  private fromPrisma(row: PrismaPosition): PositionDomain {
    return new PositionDomain({
      id: row.id,
      title: row.title,
      description: row.description,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toPrismaCreate(domain: PositionDomain): Prisma.PositionUncheckedCreateInput {
    return {
      title: domain.title,
      description: domain.description,
    };
  }

  private toPrismaUpdate(domain: Partial<PositionDomain>): Prisma.PositionUncheckedUpdateInput {
    return {
      ...(domain.title !== undefined ? { title: domain.title } : {}),
      ...(domain.description !== undefined ? { description: domain.description } : {}),
    };
  }
}


