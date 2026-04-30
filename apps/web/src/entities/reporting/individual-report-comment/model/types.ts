export * from '../../individual-report/model/types';

import {
    CreateReportCommentPayload,
    ReportCommentDto,
    ReportCommentResponseDto,
} from '@intra/shared-kernel';

import {
    ENTITY_TYPES_ENUM_VALUES,
    EntityType,
    ReportDto,
    ReportFilterQuery,
    ReportResponseDto,
    ReportSortField,
    ReportTextAnswerDto,
    RESPONDENT_CATEGORIES_ENUM_VALUES,
    RespondentCategory,
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
    SortDirection,
} from '../../individual-report/model/types';

import type {
    AnswerDto,
    AnswerResponseDto,
} from '@entities/feedback360/answer/model/types';
import {
    ANSWER_TYPES_ENUM_VALUES,
    AnswerType,
} from '@entities/feedback360/answer/model/types';

export type {
    AnswerDto,
    AnswerResponseDto,
    CreateReportCommentPayload,
    ReportCommentDto,
    ReportCommentResponseDto,
    ReportDto,
    ReportFilterQuery,
    ReportResponseDto,
    ReportTextAnswerDto,
};

export {
    ANSWER_TYPES_ENUM_VALUES,
    AnswerType,
    ENTITY_TYPES_ENUM_VALUES,
    EntityType,
    ReportSortField,
    RESPONDENT_CATEGORIES_ENUM_VALUES,
    RespondentCategory,
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
    SortDirection,
};
