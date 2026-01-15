import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import { PositionHierarchyRepositoryPort } from '../../application/ports/position-hierarchy.repository.port';
import { OrgStructureMapper } from './org-structure.mapper';
import type { PositionHierarchyDomain } from '../../domain/position-hierarchy.domain';

@Injectable()
export class PositionHierarchyRepository implements PositionHierarchyRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async link(parentPositionId: number, childPositionId: number): Promise<PositionHierarchyDomain> {
    try {
      const created = await this.prisma.positionHierarchy.create({
        data: { parentPositionId, childPositionId },
      });
      return OrgStructureMapper.toPositionHierarchyDomain(created);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const existing = await this.prisma.positionHierarchy.findUnique({
          where: {
            parentPositionId_childPositionId: { parentPositionId, childPositionId },
          },
        });
        if (existing) return OrgStructureMapper.toPositionHierarchyDomain(existing);
      }
      throw error;
    }
  }

  async unlink(parentPositionId: number, childPositionId: number): Promise<void> {
    await this.prisma.positionHierarchy.deleteMany({
      where: { parentPositionId, childPositionId },
    });
  }

  async listChildren(parentPositionId: number): Promise<PositionHierarchyDomain[]> {
    const relations = await this.prisma.positionHierarchy.findMany({
      where: { parentPositionId },
      orderBy: { createdAt: 'desc' },
    });
    return relations.map(OrgStructureMapper.toPositionHierarchyDomain);
  }

  async listParents(childPositionId: number): Promise<PositionHierarchyDomain[]> {
    const relations = await this.prisma.positionHierarchy.findMany({
      where: { childPositionId },
      orderBy: { createdAt: 'desc' },
    });
    return relations.map(OrgStructureMapper.toPositionHierarchyDomain);
  }
}
