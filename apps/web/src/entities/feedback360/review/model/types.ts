import {
    CreateReviewPayload,
    ResponseStatus,
    ReviewDto,
    ReviewSearchQuery as ReviewFilterQuery,
    ReviewResponseDto,
    ReviewSortField,
    ReviewStage,
    UpdateReviewPayload,
} from '@intra/shared-kernel';

export { ResponseStatus, ReviewSortField, ReviewStage };
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
