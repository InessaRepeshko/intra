import type {
    ReportAnalyticsResponseDto,
    ReportInsightResponseDto,
    ReportResponseDto,
} from '@entities/reporting/individual-report/model/types';

export interface Report extends Omit<ReportResponseDto, 'createdAt'> {
    createdAt: Date;
    analytics?: ReportAnalytics[] | null;
    questionInsights?: ReportInsight[] | null;
    competenceInsights?: ReportInsight[] | null;
}

export function mapReportDtoToModel(
    dto: ReportResponseDto & {
        analytics?: ReportAnalyticsResponseDto[] | null;
        questionInsights?: ReportInsightResponseDto[] | null;
        competenceInsights?: ReportInsightResponseDto[] | null;
    },
): Report {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
        analytics: dto.analytics
            ? dto.analytics.map(mapReportAnalyticsDtoToModel)
            : null,
        questionInsights:
            dto.questionInsights?.map(mapReportInsightDtoToModel) || null,
        competenceInsights:
            dto.competenceInsights?.map(mapReportInsightDtoToModel) || null,
    };
}

export interface ReportAnalytics extends Omit<
    ReportAnalyticsResponseDto,
    'createdAt'
> {
    createdAt: Date;
}

export function mapReportAnalyticsDtoToModel(
    dto: ReportAnalyticsResponseDto,
): ReportAnalytics {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
    };
}

export interface ReportInsight extends Omit<
    ReportInsightResponseDto,
    'createdAt'
> {
    createdAt: Date;
}

export function mapReportInsightDtoToModel(
    dto: ReportInsightResponseDto,
): ReportInsight {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
    };
}
