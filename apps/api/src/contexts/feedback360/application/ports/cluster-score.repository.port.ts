import { ClusterScoreDomain } from '../../domain/cluster-score.domain';

export const CLUSTER_SCORE_REPOSITORY = Symbol('FEEDBACK360.CLUSTER_SCORE_REPOSITORY');

export type ClusterScoreSearchQuery = {
  cycleId?: number;
  clusterId?: number;
  userId?: number;
  reviewId?: number;
};

export interface ClusterScoreRepositoryPort {
  upsert(score: ClusterScoreDomain): Promise<ClusterScoreDomain>;
  list(query: ClusterScoreSearchQuery): Promise<ClusterScoreDomain[]>;
  deleteById(id: number): Promise<void>;
}
