import {
    CreatePositionPayload,
    PositionDto,
    PositionSearchQuery as PositionFilterQuery,
    PositionResponseDto,
    UpdatePositionPayload,
} from '@intra/shared-kernel';

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
