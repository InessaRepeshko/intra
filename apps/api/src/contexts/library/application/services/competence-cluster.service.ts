import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CompetenceClusterDomain } from '../../domain/competence-cluster.domain';
import {
  COMPETENCE_CLUSTER_REPOSITORY,
  CompetenceClusterRepositoryPort,
  CompetenceClusterSearchQuery,
  CompetenceClusterUpdatePayload,
} from '../ports/competence-cluster.repository.port';
import { CompetenceService } from './competence.service';

export type CreateCompetenceClusterCommand = {
  competenceId: number;
  cycleId?: number | null;
  lowerBound: number;
  upperBound: number;
  minScore: number;
  maxScore: number;
  averageScore: number;
  employeesCount: number;
};

export type UpdateCompetenceClusterCommand = Partial<CreateCompetenceClusterCommand>;

@Injectable()
export class CompetenceClusterService {
  constructor(
    @Inject(COMPETENCE_CLUSTER_REPOSITORY) private readonly clusters: CompetenceClusterRepositoryPort,
    private readonly competences: CompetenceService,
  ) {}

  async create(command: CreateCompetenceClusterCommand): Promise<CompetenceClusterDomain> {
    await this.ensureBounds(command.lowerBound, command.upperBound);
    await this.competences.getById(command.competenceId);

    const cluster = CompetenceClusterDomain.create({
      competenceId: command.competenceId,
      cycleId: command.cycleId ?? null,
      lowerBound: command.lowerBound,
      upperBound: command.upperBound,
      minScore: command.minScore,
      maxScore: command.maxScore,
      averageScore: command.averageScore,
      employeesCount: command.employeesCount,
    });

    return this.clusters.create(cluster);
  }

  async search(query: CompetenceClusterSearchQuery): Promise<CompetenceClusterDomain[]> {
    return this.clusters.search(query);
  }

  async getById(id: number): Promise<CompetenceClusterDomain> {
    const cluster = await this.clusters.findById(id);
    if (!cluster) throw new NotFoundException('Competence cluster not found');
    return cluster;
  }

  async update(id: number, patch: UpdateCompetenceClusterCommand): Promise<CompetenceClusterDomain> {
    const current = await this.getById(id);

    if (patch.competenceId && patch.competenceId !== current.competenceId) {
      await this.competences.getById(patch.competenceId);
    }

    if (patch.lowerBound !== undefined || patch.upperBound !== undefined) {
      const lower = patch.lowerBound ?? current.lowerBound;
      const upper = patch.upperBound ?? current.upperBound;
      await this.ensureBounds(lower, upper);
    }

    const payload: CompetenceClusterUpdatePayload = {
      ...(patch.competenceId !== undefined ? { competenceId: patch.competenceId } : {}),
      ...(patch.cycleId !== undefined ? { cycleId: patch.cycleId } : {}),
      ...(patch.lowerBound !== undefined ? { lowerBound: patch.lowerBound } : {}),
      ...(patch.upperBound !== undefined ? { upperBound: patch.upperBound } : {}),
      ...(patch.minScore !== undefined ? { minScore: patch.minScore } : {}),
      ...(patch.maxScore !== undefined ? { maxScore: patch.maxScore } : {}),
      ...(patch.averageScore !== undefined ? { averageScore: patch.averageScore } : {}),
      ...(patch.employeesCount !== undefined ? { employeesCount: patch.employeesCount } : {}),
    };

    return this.clusters.updateById(id, payload);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.clusters.deleteById(id);
  }

  private async ensureBounds(lower: number, upper: number): Promise<void> {
    if (lower > upper) {
      throw new BadRequestException('lowerBound must be less than or equal to upperBound');
    }
  }
}

