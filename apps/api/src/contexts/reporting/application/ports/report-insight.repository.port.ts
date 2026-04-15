import { ReportInsightDomain } from '../../domain/report-insight.domain';

export const REPORT_INSIGHT_REPOSITORY = Symbol(
    'REPORTING.REPORT_INSIGHT_REPOSITORY',
);

export interface ReportInsightRepositoryPort {
    findByReportId(reportId: number): Promise<ReportInsightDomain[]>;
    findById(id: number): Promise<ReportInsightDomain | null>;
    createMany(
        reportId: number,
        insights: ReportInsightDomain[],
    ): Promise<void>;
}
