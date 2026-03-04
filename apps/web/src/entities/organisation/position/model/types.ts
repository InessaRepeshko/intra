import {
    CreatePositionPayload,
    PositionDto,
    PositionSearchQuery as PositionFilterQuery,
    PositionResponseDto,
    SortDirection,
    UpdatePositionPayload,
} from '@intra/shared-kernel';

export { SortDirection };

export type {
    CreatePositionPayload,
    PositionDto,
    PositionFilterQuery,
    PositionResponseDto,
    UpdatePositionPayload,
};

export type PositionQueryDto = PositionFilterQuery & {
    page?: number;
    limit?: number;
};
