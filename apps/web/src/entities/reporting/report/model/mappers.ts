import type {
    ReportAnalyticsResponseDto,
    ReportResponseDto,
} from '@entities/reporting/report/model/types';

export interface Report extends Omit<ReportResponseDto, 'createdAt'> {
    createdAt: Date;
}

export function mapReportDtoToModel(dto: ReportResponseDto): Report {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
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
