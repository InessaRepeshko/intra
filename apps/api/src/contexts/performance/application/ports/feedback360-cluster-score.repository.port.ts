import { Feedback360ClusterScoreDomain } from '../../domain/feedback360-cluster-score.domain';

export const FEEDBACK360_CLUSTER_SCORE_REPOSITORY = Symbol('PERFORMANCE.FEEDBACK360_CLUSTER_SCORE_REPOSITORY');

export type Feedback360ClusterScoreSearchQuery = {
  cycleId?: number;
  clusterId?: number;
  userId?: number;
  feedback360Id?: number;
};

export interface Feedback360ClusterScoreRepositoryPort {
  upsert(score: Feedback360ClusterScoreDomain): Promise<Feedback360ClusterScoreDomain>;
  list(query: Feedback360ClusterScoreSearchQuery): Promise<Feedback360ClusterScoreDomain[]>;
  deleteById(id: number): Promise<void>;
}
