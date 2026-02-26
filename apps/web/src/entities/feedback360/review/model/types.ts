import {
    CreateReviewPayload,
    ResponseStatus,
    ReviewDto,
    ReviewSearchQuery as ReviewFilterQuery,
    ReviewResponseDto,
    ReviewSortField,
    ReviewStage,
    SortDirection,
    UpdateReviewPayload,
} from '@intra/shared-kernel';

export { ResponseStatus, ReviewSortField, ReviewStage, SortDirection };
export type {
    CreateReviewPayload,
    ReviewDto,
    ReviewFilterQuery,
    ReviewResponseDto,
    UpdateReviewPayload,
};

export type ReviewQueryDto = ReviewFilterQuery & {
    page?: number;
    limit?: number;
};
