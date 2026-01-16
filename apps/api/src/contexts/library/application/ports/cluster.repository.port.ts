import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { ClusterDomain } from '../../domain/cluster.domain';

export const CLUSTER_REPOSITORY = Symbol('LIBRARY.CLUSTER_REPOSITORY');

export enum ClusterSortField {
  ID = 'id',
  LOWER_BOUND = 'lowerBound',
  UPPER_BOUND = 'upperBound',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type ClusterSearchQuery = {
  competenceId?: number;
  cycleId?: number | null;
  sortBy?: ClusterSortField;
  sortDirection?: SortDirection;
};

export type ClusterUpdatePayload = Partial<{
  competenceId: number;
  cycleId: number | null;
  lowerBound: number;
  upperBound: number;
  minScore: number;
  maxScore: number;
  averageScore: number;
  employeesCount: number;
}>;

export interface ClusterRepositoryPort {
  create(cluster: ClusterDomain): Promise<ClusterDomain>;
  findById(id: number): Promise<ClusterDomain | null>;
  search(query: ClusterSearchQuery): Promise<ClusterDomain[]>;
  updateById(id: number, patch: ClusterUpdatePayload): Promise<ClusterDomain>;
  deleteById(id: number): Promise<void>;
}

