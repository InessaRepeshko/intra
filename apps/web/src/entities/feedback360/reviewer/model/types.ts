import {
    AddReviewerPayload,
    ReviewerDto,
    ReviewerSearchQuery as ReviewerFilterQuery,
    ReviewerResponseDto,
} from '@intra/shared-kernel';

export type { ReviewerDto, ReviewerFilterQuery, ReviewerResponseDto };

export type AddReviewerToReviewPayload = Omit<AddReviewerPayload, 'reviewId'>;
