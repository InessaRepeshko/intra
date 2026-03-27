import { ClusterScoreAnalyticsDomain } from '../../../domain/cluster-score-analytics.domain';
import { ClusterScoreAnalyticsResponse } from '../models/cluster-score-analytics.response';
import { ClusterScoreHttpMapper } from './cluster-score.http.mapper';

export class ClusterScoreAnalyticsHttpMapper {
    static toResponse(
        domain: ClusterScoreAnalyticsDomain,
    ): ClusterScoreAnalyticsResponse {
        const view = new ClusterScoreAnalyticsResponse();
        view.id = domain.id!;
        view.cycleId = domain.cycleId;
        view.clusterId = domain.clusterId;
        view.lowerBound = ClusterScoreHttpMapper.toScoreRoundedNumber(
            domain.lowerBound,
        )!;
        view.upperBound = ClusterScoreHttpMapper.toScoreRoundedNumber(
            domain.upperBound,
        )!;
        view.employeesCount = ClusterScoreHttpMapper.toScoreRoundedNumber(
            domain.employeesCount,
        )!;
        view.employeeDensity = ClusterScoreHttpMapper.toScoreRoundedNumber(
            domain.employeeDensity,
        )!;
        view.minScore = ClusterScoreHttpMapper.toScoreRoundedNumber(
            domain.minScore,
        )!;
        view.maxScore = ClusterScoreHttpMapper.toScoreRoundedNumber(
            domain.maxScore,
        )!;
        view.averageScore = ClusterScoreHttpMapper.toScoreRoundedNumber(
            domain.averageScore,
        )!;
        view.createdAt = domain.createdAt!;
        view.updatedAt = domain.updatedAt!;
        return view;
    }
}
