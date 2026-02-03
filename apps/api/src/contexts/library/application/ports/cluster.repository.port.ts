import { ClusterSearchQuery, UpdateClusterPayload } from '@intra/shared-kernel';
import { ClusterDomain } from '../../domain/cluster.domain';

export const CLUSTER_REPOSITORY = Symbol('LIBRARY.CLUSTER_REPOSITORY');

export interface ClusterRepositoryPort {
    create(cluster: ClusterDomain): Promise<ClusterDomain>;
    findById(id: number): Promise<ClusterDomain | null>;
    search(query: ClusterSearchQuery): Promise<ClusterDomain[]>;
    updateById(id: number, patch: UpdateClusterPayload): Promise<ClusterDomain>;
    deleteById(id: number): Promise<void>;
}
