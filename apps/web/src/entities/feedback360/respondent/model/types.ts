import {
    AddRespondentPayload,
    RespondentDto,
    RespondentSearchQuery as RespondentFilterQuery,
    RespondentResponseDto,
    ResponseStatus,
    UpdateRespondentPayload,
} from '@intra/shared-kernel';

export { ResponseStatus };

export type {
    RespondentDto,
    RespondentFilterQuery,
    RespondentResponseDto,
    UpdateRespondentPayload,
};

export type AddRespondentToReviewPayload = Omit<
    AddRespondentPayload,
    'reviewId'
>;
