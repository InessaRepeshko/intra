import {
    CreateReviewPayload,
    ResponseStatus,
    REVIEW_STAGES as REVIEW_STAGE_ENUM_VALUES,
    ReviewDto,
    ReviewSearchQuery as ReviewFilterQuery,
    ReviewResponseDto,
    ReviewSortField,
    ReviewStage,
    SortDirection,
    UpdateReviewPayload,
} from '@intra/shared-kernel';

export {
    ResponseStatus,
    REVIEW_STAGE_ENUM_VALUES,
    ReviewSortField,
    ReviewStage,
    SortDirection,
};
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
