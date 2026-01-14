import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PositionRepositoryPort } from '../ports/position.repository.port';
import {
  ORG_POSITION_REPOSITORY,
  PositionSearchQuery,
  PositionUpdatePayload,
} from '../ports/position.repository.port';
import { PositionDomain } from '../../domain/position.domain';

export type CreatePositionCommand = {
  title: string;
  description?: string | null;
};

export type UpdatePositionCommand = Partial<CreatePositionCommand>;

@Injectable()
export class PositionService {
  constructor(@Inject(ORG_POSITION_REPOSITORY) private readonly positions: PositionRepositoryPort) {}

  async create(command: CreatePositionCommand): Promise<PositionDomain> {
    const position = PositionDomain.create({
      title: command.title,
      description: command.description ?? null,
    });
    return this.positions.create(position);
  }

  async search(query: PositionSearchQuery): Promise<PositionDomain[]> {
    return this.positions.search(query);
  }

  async getById(id: number): Promise<PositionDomain> {
    const found = await this.positions.findById(id);
    if (!found) throw new NotFoundException('Position not found');
    return found;
  }

  async update(id: number, patch: UpdatePositionCommand): Promise<PositionDomain> {
    await this.getById(id);
    const payload: PositionUpdatePayload = {
      ...patch,
      ...(patch.description !== undefined ? { description: patch.description } : {}),
    };
    return this.positions.updateById(id, payload);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.positions.deleteById(id);
  }
}
