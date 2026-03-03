import {
    ClusterScoreDto,
    ClusterScoreSearchQuery as ClusterScoreFilterQuery,
    ClusterScoreResponseDto,
    ClusterScoreSortField,
    ClusterScoreWithRelationsDto,
    SortDirection,
    UpsertClusterScorePayload,
} from '@intra/shared-kernel';

import { UserResponseDto } from '@entities/identity/user/model/types';
import { ClusterResponseDto } from '@entities/library/cluster/model/types';

export { ClusterScoreSortField, SortDirection };

export type {
    ClusterResponseDto,
    ClusterScoreDto,
    ClusterScoreFilterQuery,
    ClusterScoreResponseDto,
    ClusterScoreWithRelationsDto,
    UpsertClusterScorePayload,
    UserResponseDto,
};

export type ClusterScoreWithRelationsResponseDto = ClusterScoreResponseDto & {
    cluster: ClusterResponseDto;
    ratee: UserResponseDto;
};
