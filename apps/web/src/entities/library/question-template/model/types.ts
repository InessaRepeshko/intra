import {
    ANSWER_TYPES as ANSWER_TYPE_ENUM_VALUES,
    AnswerType,
    CreateQuestionTemplatePayload,
    QUESTION_TEMPLATE_STATUSES as QUESTION_TEMPLATE_STATUSES_ENUM_VALUES,
    QuestionTemplateDto,
    QuestionTemplateSearchQuery as QuestionTemplateFilterQuery,
    QuestionTemplateResponseDto,
    QuestionTemplateSortField,
    QuestionTemplateStatus,
    SortDirection,
    UpdateQuestionTemplatePayload,
} from '@intra/shared-kernel';

export {
    ANSWER_TYPE_ENUM_VALUES,
    AnswerType,
    QUESTION_TEMPLATE_STATUSES_ENUM_VALUES,
    QuestionTemplateSortField,
    QuestionTemplateStatus,
    SortDirection,
};

export type {
    CreateQuestionTemplatePayload,
    QuestionTemplateDto,
    QuestionTemplateFilterQuery,
    QuestionTemplateResponseDto,
    UpdateQuestionTemplatePayload,
};

export type QuestionTemplateQueryDto = QuestionTemplateFilterQuery & {
    page?: number;
    limit?: number;
};

export enum ForSelfassessmentType {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

export const FOR_SELFASSESSMENT_TYPES_ENUM_VALUES = Object.values(
    ForSelfassessmentType,
);
