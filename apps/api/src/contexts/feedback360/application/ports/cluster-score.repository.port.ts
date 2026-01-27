import { ClusterScoreDomain } from '../../domain/cluster-score.domain';
import { ClusterScoreSearchQuery } from '@intra/shared-kernel';

export const CLUSTER_SCORE_REPOSITORY = Symbol('FEEDBACK360.CLUSTER_SCORE_REPOSITORY');

export interface ClusterScoreRepositoryPort {
  upsert(score: ClusterScoreDomain): Promise<ClusterScoreDomain>;
  list(query: ClusterScoreSearchQuery): Promise<ClusterScoreDomain[]>;
  deleteById(id: number): Promise<void>;
}
