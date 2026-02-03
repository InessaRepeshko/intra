import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { PositionHierarchyRepositoryPort } from '../ports/position-hierarchy.repository.port';
import { ORG_POSITION_HIERARCHY_REPOSITORY } from '../ports/position-hierarchy.repository.port';
import { PositionService } from './position.service';
import { PositionDomain } from '../../domain/position.domain';
import { PositionHierarchyDomain } from '../../domain/position-hierarchy.domain';

@Injectable()
export class PositionHierarchyService {
  constructor(
    @Inject(ORG_POSITION_HIERARCHY_REPOSITORY) private readonly hierarchy: PositionHierarchyRepositoryPort,
    private readonly positions: PositionService,
  ) {}

  async link(parentPositionId: number, childPositionId: number): Promise<PositionHierarchyDomain> {
    if (parentPositionId === childPositionId) {
      throw new BadRequestException('Position cannot be a child of itself');
    }

    await this.positions.getById(parentPositionId);
    await this.positions.getById(childPositionId);

    return this.hierarchy.link(parentPositionId, childPositionId);
  }

  async unlink(parentPositionId: number, childPositionId: number): Promise<void> {
    await this.positions.getById(parentPositionId);
    await this.positions.getById(childPositionId);
    await this.hierarchy.unlink(parentPositionId, childPositionId);
  }

  async listChildren(parentPositionId: number): Promise<PositionDomain[]> {
    await this.positions.getById(parentPositionId);
    const relations = await this.hierarchy.listChildren(parentPositionId);
    return Promise.all(relations.map((rel) => this.positions.getById(rel.childPositionId)));
  }

  async listParents(childPositionId: number): Promise<PositionDomain[]> {
    await this.positions.getById(childPositionId);
    const relations = await this.hierarchy.listParents(childPositionId);
    return Promise.all(relations.map((rel) => this.positions.getById(rel.parentPositionId)));
  }
}
