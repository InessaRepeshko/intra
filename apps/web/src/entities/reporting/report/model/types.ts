import {
    CommentSentiment,
    EntityType,
    ReportAnalyticsDto,
    ReportDto,
    ReportSearchQuery as ReportFilterQuery,
    ReportResponseDto,
    ReportSortField,
    ReportTextAnswerDto,
    RespondentCategory,
    ReviewStage,
    SortDirection,
} from '@intra/shared-kernel';

export {
    CommentSentiment,
    EntityType,
    ReportSortField,
    RespondentCategory,
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
