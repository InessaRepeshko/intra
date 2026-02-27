import {
    CommentSentiment,
    EntityType,
    ReportAnalyticsDto,
    ReportDto,
    ReportSearchQuery as ReportFilterQuery,
    ReportResponseDto,
    ReportSortField,
    ReportTextAnswerDto,
    SortDirection,
} from '@intra/shared-kernel';

import {
    RESPONDENT_CATEGORIES_ENUM_VALUES,
    RespondentCategory,
} from '@entities/feedback360/respondent/model/types';

import {
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
} from '@entities/feedback360/review/model/types';

export {
    CommentSentiment,
    EntityType,
    ReportSortField,
    RESPONDENT_CATEGORIES_ENUM_VALUES,
    RespondentCategory,
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
    SortDirection,
};
export type {
    ReportAnalyticsDto,
    ReportDto,
    ReportFilterQuery,
    ReportResponseDto,
    ReportTextAnswerDto,
};

export type ReportQueryDto = ReportFilterQuery & {
    page?: number;
    limit?: number;
};
