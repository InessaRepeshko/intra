import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import { PositionHierarchyRepositoryPort } from '../../application/ports/position-hierarchy.repository.port';
import { OrganisationMapper } from './organisation.mapper';
import type { PositionHierarchyDomain } from '../../domain/position-hierarchy.domain';

@Injectable()
export class PositionHierarchyRepository implements PositionHierarchyRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async link(superiorPositionId: number, subordinatePositionId: number): Promise<PositionHierarchyDomain> {
    try {
      const created = await this.prisma.positionHierarchy.create({
        data: { superiorPositionId: superiorPositionId, subordinatePositionId: subordinatePositionId },
      });
      return OrganisationMapper.toPositionHierarchyDomain(created);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const existing = await this.prisma.positionHierarchy.findUnique({
          where: {
            superiorPositionId_subordinatePositionId: { superiorPositionId: superiorPositionId, subordinatePositionId: subordinatePositionId },
          },
        });
        if (existing) return OrganisationMapper.toPositionHierarchyDomain(existing);
      }
      throw error;
    }
  }

  async unlink(superiorPositionId: number, subordinatePositionId: number): Promise<void> {
    await this.prisma.positionHierarchy.deleteMany({
      where: { superiorPositionId: superiorPositionId, subordinatePositionId: subordinatePositionId },
    });
  }

  async listSubordinates(superiorPositionId: number): Promise<PositionHierarchyDomain[]> {
    const relations = await this.prisma.positionHierarchy.findMany({
      where: { superiorPositionId: superiorPositionId },
      orderBy: { createdAt: 'desc' },
    });
    return relations.map(OrganisationMapper.toPositionHierarchyDomain);
  }

  async listSuperiors(subordinatePositionId: number): Promise<PositionHierarchyDomain[]> {
    const relations = await this.prisma.positionHierarchy.findMany({
      where: { subordinatePositionId: subordinatePositionId },
      orderBy: { createdAt: 'desc' },
    });
    return relations.map(OrganisationMapper.toPositionHierarchyDomain);
  }
}
