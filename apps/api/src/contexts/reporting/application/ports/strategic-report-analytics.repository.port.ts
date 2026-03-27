import { StrategicReportAnalyticsDomain } from '../../domain/strategic-report-analytics.domain';

export const STRATEGIC_REPORT_ANALYTICS_REPOSITORY = Symbol(
    'REPORTING.STRATEGIC_REPORT_ANALYTICS_REPOSITORY',
);

export interface StrategicReportAnalyticsRepositoryPort {
    findByStrategicReportId(
        strategicReportId: number,
    ): Promise<StrategicReportAnalyticsDomain[]>;
    findById(id: number): Promise<StrategicReportAnalyticsDomain | null>;
    createMany(
        strategicReportId: number,
        analytics: StrategicReportAnalyticsDomain[],
    ): Promise<void>;
}
