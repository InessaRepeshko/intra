import {
    ClusterScoreResponseDto,
    ClusterScoreWithRelationsResponseDto,
} from '@entities/feedback360/cluster-score/model/types';
import {
    User,
    mapUserResponseDtoToModel,
} from '@entities/identity/user/model/mappers';
import {
    Cluster,
    mapClusterDtoToModel,
} from '@entities/library/cluster/model/mappers';

export interface ClusterScore extends Omit<
    ClusterScoreResponseDto,
    'createdAt' | 'updatedAt'
> {
    createdAt: Date;
    updatedAt: Date;
}

export function mapClusterScoreDtoToModel(
    dto: ClusterScoreResponseDto,
): ClusterScore {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };
}

export interface ClusterScoreWithRelations extends Omit<
    ClusterScoreWithRelationsResponseDto,
    'createdAt' | 'updatedAt' | 'cluster' | 'ratee'
> {
    createdAt: Date;
    updatedAt: Date;
    cluster: Cluster;
    ratee: User;
}

export function mapClusterScoreWithRelationsDtoToModel(
    dto: ClusterScoreWithRelationsResponseDto,
): ClusterScoreWithRelations {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
        cluster: mapClusterDtoToModel(dto.cluster),
        ratee: mapUserResponseDtoToModel(dto.ratee),
    };
}
