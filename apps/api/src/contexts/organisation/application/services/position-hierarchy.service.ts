import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { PositionHierarchyRepositoryPort } from '../ports/position-hierarchy.repository.port';
import { ORGANISATION_POSITION_HIERARCHY_REPOSITORY } from '../ports/position-hierarchy.repository.port';
import { PositionService } from './position.service';
import { PositionDomain } from '../../domain/position.domain';
import { PositionHierarchyDomain } from '../../domain/position-hierarchy.domain';

@Injectable()
export class PositionHierarchyService {
  constructor(
    @Inject(ORGANISATION_POSITION_HIERARCHY_REPOSITORY) private readonly hierarchy: PositionHierarchyRepositoryPort,
    private readonly positions: PositionService,
  ) {}

  async link(superiorPositionId: number, subordinatePositionId: number): Promise<PositionHierarchyDomain> {
    if (superiorPositionId === subordinatePositionId) {
      throw new BadRequestException('Position cannot be a subordinate of itself');
    }

    await this.positions.getById(superiorPositionId);
    await this.positions.getById(subordinatePositionId);

    return this.hierarchy.link(superiorPositionId, subordinatePositionId);
  }

  async unlink(superiorPositionId: number, subordinatePositionId: number): Promise<void> {
    await this.positions.getById(superiorPositionId);
    await this.positions.getById(subordinatePositionId);
    await this.hierarchy.unlink(superiorPositionId, subordinatePositionId);
  }

  async listSubordinates(superiorPositionId: number): Promise<PositionDomain[]> {
    await this.positions.getById(superiorPositionId);
    const relations = await this.hierarchy.listSubordinates(superiorPositionId);
    return Promise.all(relations.map((rel) => this.positions.getById(rel.subordinatePositionId)));
  }

  async listSuperiors(subordinatePositionId: number): Promise<PositionDomain[]> {
    await this.positions.getById(subordinatePositionId);
    const relations = await this.hierarchy.listSuperiors(subordinatePositionId);
    return Promise.all(relations.map((rel) => this.positions.getById(rel.superiorPositionId)));
  }
}
