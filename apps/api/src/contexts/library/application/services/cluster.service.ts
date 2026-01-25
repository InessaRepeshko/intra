import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClusterDomain } from '../../domain/cluster.domain';
import {
  CLUSTER_REPOSITORY,
  ClusterRepositoryPort,
  ClusterSearchQuery,
  ClusterUpdatePayload,
} from '../ports/cluster.repository.port';
import { CompetenceService } from './competence.service';

export type CreateClusterCommand = {
  competenceId: number;
  lowerBound: number;
  upperBound: number;
  title: string;
  description: string;
};

export type UpdateClusterCommand = Partial<CreateClusterCommand>;

@Injectable()
export class ClusterService {
  constructor(
    @Inject(CLUSTER_REPOSITORY) private readonly clusters: ClusterRepositoryPort,
    private readonly competences: CompetenceService,
  ) { }

  async create(command: CreateClusterCommand): Promise<ClusterDomain> {
    await this.ensureBounds(command.lowerBound, command.upperBound);
    await this.competences.getById(command.competenceId);

    const cluster = ClusterDomain.create({
      competenceId: command.competenceId,
      lowerBound: command.lowerBound,
      upperBound: command.upperBound,
      title: command.title,
      description: command.description,
    });

    return this.clusters.create(cluster);
  }

  async search(query: ClusterSearchQuery): Promise<ClusterDomain[]> {
    return this.clusters.search(query);
  }

  async getById(id: number): Promise<ClusterDomain> {
    const cluster = await this.clusters.findById(id);
    if (!cluster) throw new NotFoundException('Cluster not found');
    return cluster;
  }

  async update(id: number, patch: UpdateClusterCommand): Promise<ClusterDomain> {
    const current = await this.getById(id);

    if (patch.competenceId && patch.competenceId !== current.competenceId) {
      await this.competences.getById(patch.competenceId);
    }

    if (patch.lowerBound !== undefined || patch.upperBound !== undefined) {
      const lower = patch.lowerBound ?? current.lowerBound;
      const upper = patch.upperBound ?? current.upperBound;
      await this.ensureBounds(lower, upper);
    }

    const payload: ClusterUpdatePayload = {
      ...(patch.competenceId !== undefined ? { competenceId: patch.competenceId } : {}),
      ...(patch.lowerBound !== undefined ? { lowerBound: patch.lowerBound } : {}),
      ...(patch.upperBound !== undefined ? { upperBound: patch.upperBound } : {}),
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.description !== undefined ? { description: patch.description } : {}),
    };

    return this.clusters.updateById(id, payload);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.clusters.deleteById(id);
  }

  private async ensureBounds(lower: number, upper: number): Promise<void> {
    if (lower > upper) {
      throw new BadRequestException('Lower bound must be less than or equal to upper bound');
    }
  }
}

