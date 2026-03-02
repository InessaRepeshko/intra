import {
    ClusterDto,
    ClusterSearchQuery as ClusterFilterQuery,
    ClusterResponseDto,
    ClusterSortField,
    CreateClusterPayload,
    SortDirection,
    UpdateClusterPayload,
} from '@intra/shared-kernel';

export type {
    ClusterDto,
    ClusterFilterQuery,
    ClusterResponseDto,
    ClusterSortField,
    CreateClusterPayload,
    SortDirection,
    UpdateClusterPayload,
};

export type ClusterQueryDto = ClusterFilterQuery & {
    page?: number;
    limit?: number;
};
