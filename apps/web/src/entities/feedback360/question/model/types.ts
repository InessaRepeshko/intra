import {
    AddQuestionToReviewPayload,
    ANSWER_TYPES as ANSWER_TYPE_ENUM_VALUES,
    AnswerType,
    CreateQuestionPayload,
    QuestionDto,
    QuestionResponseDto,
    QuestionSortField,
    QuestionSearchQuery as QuestionTemplateFilterQuery,
    SortDirection,
} from '@intra/shared-kernel';

export {
    ANSWER_TYPE_ENUM_VALUES,
    AnswerType,
    QuestionSortField,
    SortDirection,
};

export type {
    AddQuestionToReviewPayload,
    CreateQuestionPayload,
    QuestionDto,
    QuestionResponseDto,
    QuestionTemplateFilterQuery,
};

export enum ForSelfassessmentType {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

export const FOR_SELFASSEMENT_TYPES_ENUM_VALUES = Object.values(
    ForSelfassessmentType,
);
