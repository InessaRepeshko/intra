import { ClusterScoreAnalyticsResponseDto } from '@entities/reporting/cluster-score-analytics/model/types';

export interface ClusterScoreAnalytics extends Omit<
    ClusterScoreAnalyticsResponseDto,
    'createdAt' | 'updatedAt'
> {
    createdAt: Date;
    updatedAt: Date;
}

export function mapClusterScoreAnalyticsDtoToModel(
    dto: ClusterScoreAnalyticsResponseDto,
): ClusterScoreAnalytics {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };
}
