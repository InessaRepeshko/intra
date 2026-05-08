import {
    CreatePositionPayload,
    PositionSearchQuery,
    UpdatePositionPayload,
} from '@intra/shared-kernel';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    POSITION_COMPETENCE_RELATION_REPOSITORY,
    PositionCompetenceRelationRepositoryPort,
} from 'src/contexts/library/application/ports/position-competence-relation.repository.port';
import { PositionDomain } from '../../domain/position.domain';
import type { PositionRepositoryPort } from '../ports/position.repository.port';
import { ORGANISATION_POSITION_REPOSITORY } from '../ports/position.repository.port';

@Injectable()
export class PositionService {
    constructor(
        @Inject(ORGANISATION_POSITION_REPOSITORY)
        private readonly positions: PositionRepositoryPort,
        @Inject(POSITION_COMPETENCE_RELATION_REPOSITORY)
        private readonly positionCompetenceRelations: PositionCompetenceRelationRepositoryPort,
    ) {}

    async create(payload: CreatePositionPayload): Promise<PositionDomain> {
        const position = PositionDomain.create({
            title: payload.title,
            description: payload.description ?? null,
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

    async update(
        id: number,
        patch: UpdatePositionPayload,
    ): Promise<PositionDomain> {
        await this.getById(id);
        const payload: UpdatePositionPayload = {
            ...patch,
            ...(patch.description !== undefined
                ? { description: patch.description }
                : {}),
        };
        return this.positions.updateById(id, payload);
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        await this.positions.deleteById(id);
    }

    async listCompetences(positionId: number): Promise<number[]> {
        await this.getById(positionId);
        const relations =
            await this.positionCompetenceRelations.listByPosition(positionId);
        return relations.map((r) => r.competenceId);
    }
}
