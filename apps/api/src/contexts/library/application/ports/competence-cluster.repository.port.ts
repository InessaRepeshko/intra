import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { CompetenceClusterDomain } from '../../domain/competence-cluster.domain';

export const COMPETENCE_CLUSTER_REPOSITORY = Symbol('COMPETENCE.CLUSTER_REPOSITORY');

export enum CompetenceClusterSortField {
  ID = 'id',
  LOWER_BOUND = 'lowerBound',
  UPPER_BOUND = 'upperBound',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type CompetenceClusterSearchQuery = {
  competenceId?: number;
  cycleId?: number | null;
  sortBy?: CompetenceClusterSortField;
  sortDirection?: SortDirection;
};

export type CompetenceClusterUpdatePayload = Partial<{
  competenceId: number;
  cycleId: number | null;
  lowerBound: number;
  upperBound: number;
  minScore: number;
  maxScore: number;
  averageScore: number;
  employeesCount: number;
}>;

export interface CompetenceClusterRepositoryPort {
  create(cluster: CompetenceClusterDomain): Promise<CompetenceClusterDomain>;
  findById(id: number): Promise<CompetenceClusterDomain | null>;
  search(query: CompetenceClusterSearchQuery): Promise<CompetenceClusterDomain[]>;
  updateById(id: number, patch: CompetenceClusterUpdatePayload): Promise<CompetenceClusterDomain>;
  deleteById(id: number): Promise<void>;
}

