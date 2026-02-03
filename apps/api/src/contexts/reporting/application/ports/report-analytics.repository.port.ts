import { ReportAnalyticsDomain } from '../../domain/report-analytics.domain';

export const REPORT_ANALYTICS_REPOSITORY = Symbol(
    'REPORTING.REPORT_ANALYTICS_REPOSITORY',
);

export interface ReportAnalyticsRepositoryPort {
    findByReportId(reportId: number): Promise<ReportAnalyticsDomain[]>;
    findById(id: number): Promise<ReportAnalyticsDomain | null>;
}
