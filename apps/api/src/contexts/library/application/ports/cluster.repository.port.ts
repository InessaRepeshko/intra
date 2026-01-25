import { SortDirection } from '@intra/shared-kernel';
import { ClusterDomain } from '../../domain/cluster.domain';

export const CLUSTER_REPOSITORY = Symbol('LIBRARY.CLUSTER_REPOSITORY');

export enum ClusterSortField {
  ID = 'id',
  LOWER_BOUND = 'lowerBound',
  UPPER_BOUND = 'upperBound',
  TITLE = 'title',
  DESCRIPTION = 'description',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type ClusterSearchQuery = {
  competenceId?: number;
  sortBy?: ClusterSortField;
  sortDirection?: SortDirection;
};

export type ClusterUpdatePayload = Partial<{
  competenceId: number;
  lowerBound: number;
  upperBound: number;
  title: string;
  description: string;
}>;

export interface ClusterRepositoryPort {
  create(cluster: ClusterDomain): Promise<ClusterDomain>;
  findById(id: number): Promise<ClusterDomain | null>;
  search(query: ClusterSearchQuery): Promise<ClusterDomain[]>;
  updateById(id: number, patch: ClusterUpdatePayload): Promise<ClusterDomain>;
  deleteById(id: number): Promise<void>;
}
