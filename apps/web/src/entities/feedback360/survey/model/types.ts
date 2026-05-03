import {
    ANSWER_TYPES as ANSWER_TYPE_ENUM_VALUES,
    AnswerType,
    QuestionDto,
    QuestionResponseDto,
    QuestionSortField,
    QuestionSearchQuery as QuestionTemplateFilterQuery,
    RespondentCategory,
    ResponseStatus,
    REVIEW_STAGES as REVIEW_STAGE_ENUM_VALUES,
    ReviewQuestionRelationDto,
    ReviewQuestionRelationSearchQuery as ReviewQuestionRelationFilterQuery,
    ReviewQuestionRelationResponseDto,
    ReviewQuestionRelationSortField,
    ReviewStage,
    SortDirection,
} from '@intra/shared-kernel';

export type {
    QuestionDto,
    QuestionResponseDto,
    QuestionTemplateFilterQuery,
    ReviewQuestionRelationDto,
    ReviewQuestionRelationFilterQuery,
    ReviewQuestionRelationResponseDto,
};

export {
    ANSWER_TYPE_ENUM_VALUES,
    AnswerType,
    QuestionSortField,
    RespondentCategory,
    ResponseStatus,
    REVIEW_STAGE_ENUM_VALUES,
    ReviewQuestionRelationSortField,
    ReviewStage,
    SortDirection,
};

export enum ForSelfassessmentType {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

export const FOR_SELFASSEMENT_TYPES_ENUM_VALUES = Object.values(
    ForSelfassessmentType,
);
