import Decimal from 'decimal.js';
import { ClusterScoreWithRelationsDomain } from 'src/contexts/feedback360/domain/cluster-score-with-relations.domain';
import { UserHttpMapper } from 'src/contexts/identity/presentation/http/mappers/user.http.mapper';
import { ClusterHttpMapper } from 'src/contexts/library/presentation/http/mappers/cluster.http.mapper';
import { ClusterScoreDomain } from '../../../domain/cluster-score.domain';
import { ClusterScoreWithRelationsResponse } from '../models/cluster-score-with-relations.response';
import { ClusterScoreResponse } from '../models/cluster-score.response';

export class ClusterScoreHttpMapper {
    static toResponse(domain: ClusterScoreDomain): ClusterScoreResponse {
        const view = new ClusterScoreResponse();
        view.id = domain.id!;
        view.cycleId = domain.cycleId ?? null;
        view.clusterId = domain.clusterId;
        view.rateeId = domain.rateeId;
        view.reviewId = domain.reviewId ?? null;
        view.score = ClusterScoreHttpMapper.toScoreRoundedNumber(domain.score)!;
        view.answersCount = domain.answersCount;
        view.createdAt = domain.createdAt!;
        view.updatedAt = domain.updatedAt!;
        return view;
    }

    static toResponseWithRelations(
        domain: ClusterScoreWithRelationsDomain,
    ): ClusterScoreWithRelationsResponse {
        const view = new ClusterScoreWithRelationsResponse();
        view.id = domain.id!;
        view.cycleId = domain.cycleId ?? null;
        view.clusterId = domain.clusterId;
        view.rateeId = domain.rateeId;
        view.reviewId = domain.reviewId ?? null;
        view.score = ClusterScoreHttpMapper.toScoreRoundedNumber(domain.score)!;
        view.answersCount = domain.answersCount;
        view.createdAt = domain.createdAt!;
        view.updatedAt = domain.updatedAt!;
        view.cluster = ClusterHttpMapper.toResponse(domain.cluster);
        view.ratee = UserHttpMapper.toResponse(domain.ratee);
        return view;
    }

    static toScoreRoundedNumber(
        value: Decimal | number | null | undefined,
    ): number | null {
        if (value === null || value === undefined) return null;
        const decimalValue =
            value instanceof Decimal ? value : new Decimal(value);
        return Number(decimalValue.toDecimalPlaces(4).toFixed(4));
    }
}
