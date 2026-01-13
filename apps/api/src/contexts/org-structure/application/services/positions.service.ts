import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PositionDomain } from '../../domain/entities/position.domain';
import { POSITION_REPOSITORY, PositionRepositoryPort, PositionSearchQuery, PositionSearchResult } from '../../domain/repositories/position.repository.port';

export type CreatePositionInput = {
  title: string;
  description?: string | null;
};

export type UpdatePositionInput = {
  title?: string;
  description?: string | null;
};

@Injectable()
export class PositionsService {
  constructor(
    @Inject(POSITION_REPOSITORY) private readonly positionsRepo: PositionRepositoryPort,
  ) {}

  async create(input: CreatePositionInput): Promise<PositionDomain> {
    const position = new PositionDomain({
      title: input.title,
      description: input.description ?? null,
    });
    return this.positionsRepo.create(position);
  }

  async findAll(): Promise<PositionDomain[]> {
    return this.positionsRepo.findAll();
  }

  async search(query?: PositionSearchQuery): Promise<PositionSearchResult> {
    return this.positionsRepo.search(query);
  }

  async findOne(id: number): Promise<PositionDomain> {
    const found = await this.positionsRepo.findById(id);
    if (!found) throw new NotFoundException('Position not found');
    return found;
  }

  async findOneWithRelations(id: number): Promise<PositionDomain> {
    const found = await this.positionsRepo.findByIdWithRelations(id);
    if (!found) throw new NotFoundException('Position not found');
    return found;
  }

  async update(id: number, patch: UpdatePositionInput): Promise<PositionDomain> {
    await this.findOne(id);
    return this.positionsRepo.updateById(id, patch);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.positionsRepo.deleteById(id);
  }
}

