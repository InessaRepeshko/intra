import type {
    StrategicReportAnalyticsResponseDto,
    StrategicReportInsightResponseDto,
    StrategicReportResponseDto,
} from '@entities/reporting/strategic-report/model/types';

export interface StrategicReport extends Omit<
    StrategicReportResponseDto,
    'createdAt'
> {
    createdAt: Date;
    analytics?: StrategicReportAnalytics[] | null;
    insights?: StrategicReportInsight[] | null;
}

export function mapStrategicReportDtoToModel(
    dto: StrategicReportResponseDto & {
        analytics?: StrategicReportAnalyticsResponseDto[] | null;
        insights?: StrategicReportInsightResponseDto[] | null;
    },
): StrategicReport {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
        analytics: dto.analytics
            ? dto.analytics.map(mapStrategicReportAnalyticsDtoToModel)
            : null,
        insights:
            dto.insights?.map(mapStrategicReportInsightDtoToModel) || null,
    };
}

export interface StrategicReportAnalytics extends Omit<
    StrategicReportAnalyticsResponseDto,
    'createdAt'
> {
    createdAt: Date;
}

export function mapStrategicReportAnalyticsDtoToModel(
    dto: StrategicReportAnalyticsResponseDto,
): StrategicReportAnalytics {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
    };
}

export interface StrategicReportInsight extends Omit<
    StrategicReportInsightResponseDto,
    'createdAt'
> {
    createdAt: Date;
}

export function mapStrategicReportInsightDtoToModel(
    dto: StrategicReportInsightResponseDto,
): StrategicReportInsight {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
    };
}
