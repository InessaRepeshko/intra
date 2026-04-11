import type {
    StrategicReportAnalyticsResponseDto,
    StrategicReportResponseDto,
} from '@entities/reporting/strategic-report/model/types';

export interface StrategicReport extends Omit<
    StrategicReportResponseDto,
    'createdAt'
> {
    createdAt: Date;
}

export function mapStrategicReportDtoToModel(
    dto: StrategicReportResponseDto,
): StrategicReport {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
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
