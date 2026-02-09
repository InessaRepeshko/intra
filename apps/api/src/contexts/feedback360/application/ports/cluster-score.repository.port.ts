import { ClusterScoreSearchQuery } from '@intra/shared-kernel';
import { ClusterScoreWithRelationsDomain } from '../../domain/cluster-score-with-relations.domain';
import { ClusterScoreDomain } from '../../domain/cluster-score.domain';

export const CLUSTER_SCORE_REPOSITORY = Symbol(
    'FEEDBACK360.CLUSTER_SCORE_REPOSITORY',
);

export interface ClusterScoreRepositoryPort {
    upsert(score: ClusterScoreDomain): Promise<ClusterScoreDomain>;
    list(query: ClusterScoreSearchQuery): Promise<ClusterScoreDomain[]>;
    getById(id: number): Promise<ClusterScoreWithRelationsDomain>;
    deleteById(id: number): Promise<void>;
    getByCycleId(cycleId: number): Promise<ClusterScoreWithRelationsDomain[]>;
}
