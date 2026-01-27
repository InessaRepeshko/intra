import { SortDirection } from '@intra/shared-kernel';
import { CompetenceDomain } from '../../domain/competence.domain';

export const COMPETENCE_REPOSITORY = Symbol('LIBRARY.COMPETENCE_REPOSITORY');

export enum CompetenceSortField {
  ID = 'id',
  CODE = 'code',
  TITLE = 'title',
  DESCRIPTION = 'description',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type CompetenceSearchQuery = {
  code?: string;
  title?: string;
  description?: string;
  search?: string;
  sortBy?: CompetenceSortField;
  sortDirection?: SortDirection;
};

export type CompetenceUpdatePayload = Partial<{
  code: string | null;
  title: string;
  description: string | null;
}>;

export interface CompetenceRepositoryPort {
  create(competence: CompetenceDomain): Promise<CompetenceDomain>;
  findById(id: number): Promise<CompetenceDomain | null>;
  search(query: CompetenceSearchQuery): Promise<CompetenceDomain[]>;
  updateById(id: number, patch: CompetenceUpdatePayload): Promise<CompetenceDomain>;
  deleteById(id: number): Promise<void>;
}

