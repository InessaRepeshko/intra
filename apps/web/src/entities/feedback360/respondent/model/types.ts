import {
    AddRespondentPayload,
    RESPONDENT_CATEGORIES as RESPONDENT_CATEGORIES_ENUM_VALUES,
    RespondentCategory,
    RespondentDto,
    RespondentSearchQuery as RespondentFilterQuery,
    RespondentResponseDto,
    ResponseStatus,
    UpdateRespondentPayload,
} from '@intra/shared-kernel';

export {
    RESPONDENT_CATEGORIES_ENUM_VALUES,
    RespondentCategory,
    ResponseStatus,
};

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
