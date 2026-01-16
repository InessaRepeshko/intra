import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COMPETENCE_REPOSITORY, CompetenceRepositoryPort, CompetenceSearchQuery, CompetenceUpdatePayload } from '../ports/competence.repository.port';
import { CompetenceDomain } from '../../domain/competence.domain';

export type CreateCompetenceCommand = {
  code?: string | null;
  title: string;
  description?: string | null;
};

export type UpdateCompetenceCommand = Partial<CreateCompetenceCommand>;

@Injectable()
export class CompetenceService {
  constructor(@Inject(COMPETENCE_REPOSITORY) private readonly competences: CompetenceRepositoryPort) {}

  async create(command: CreateCompetenceCommand): Promise<CompetenceDomain> {
    const competence = CompetenceDomain.create({
      code: command.code ?? null,
      title: command.title,
      description: command.description ?? null,
    });
    return this.competences.create(competence);
  }

  async search(query: CompetenceSearchQuery): Promise<CompetenceDomain[]> {
    return this.competences.search(query);
  }

  async getById(id: number): Promise<CompetenceDomain> {
    const competence = await this.competences.findById(id);
    if (!competence) throw new NotFoundException('Competence not found');
    return competence;
  }

  async update(id: number, patch: UpdateCompetenceCommand): Promise<CompetenceDomain> {
    await this.getById(id);
    const payload: CompetenceUpdatePayload = {
      ...(patch.code !== undefined ? { code: patch.code } : {}),
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.description !== undefined ? { description: patch.description } : {}),
    };
    return this.competences.updateById(id, payload);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.competences.deleteById(id);
  }
}

