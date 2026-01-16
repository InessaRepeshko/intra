import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { CompetenceDomain } from '../../domain/competence.domain';

export const COMPETENCE_REPOSITORY = Symbol('COMPETENCE.REPOSITORY');

export enum CompetenceSortField {
  ID = 'id',
  CODE = 'code',
  TITLE = 'title',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type CompetenceSearchQuery = {
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

