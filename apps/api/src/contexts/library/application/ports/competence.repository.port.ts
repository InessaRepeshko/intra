import {
    CompetenceSearchQuery,
    UpdateCompetencePayload,
} from '@intra/shared-kernel';
import { CompetenceDomain } from '../../domain/competence.domain';

export const COMPETENCE_REPOSITORY = Symbol('LIBRARY.COMPETENCE_REPOSITORY');

export interface CompetenceRepositoryPort {
    create(competence: CompetenceDomain): Promise<CompetenceDomain>;
    findById(id: number): Promise<CompetenceDomain | null>;
    search(query: CompetenceSearchQuery): Promise<CompetenceDomain[]>;
    updateById(
        id: number,
        patch: UpdateCompetencePayload,
    ): Promise<CompetenceDomain>;
    deleteById(id: number): Promise<void>;
}
