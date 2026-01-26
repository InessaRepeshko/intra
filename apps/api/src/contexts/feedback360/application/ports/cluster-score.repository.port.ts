import { ClusterScoreDomain } from '../../domain/cluster-score.domain';
import { SortDirection } from '@intra/shared-kernel';

export const CLUSTER_SCORE_REPOSITORY = Symbol('FEEDBACK360.CLUSTER_SCORE_REPOSITORY');

export enum ClusterScoreSortField {
  ID = 'id',
  CYCLE_ID = 'cycleId',
  CLUSTER_ID = 'clusterId',
  RATEE_ID = 'rateeId',
  REVIEW_ID = 'reviewId',
  SCORE = 'score',
  ANSWER_COUNT = 'answerCount',
  CREATED_AT='createdAt',
  UPDATED_AT='updatedAt',
}

export type ClusterScoreSearchQuery = {
  cycleId?: number;
  clusterId?: number;
  rateeId?: number;
  reviewId?: number;
  score?: number;
  answerCount?: number;
  sortBy?: ClusterScoreSortField;
  sortDirection?: SortDirection;
};

export interface ClusterScoreRepositoryPort {
  upsert(score: ClusterScoreDomain): Promise<ClusterScoreDomain>;
  list(query: ClusterScoreSearchQuery): Promise<ClusterScoreDomain[]>;
  deleteById(id: number): Promise<void>;
}
