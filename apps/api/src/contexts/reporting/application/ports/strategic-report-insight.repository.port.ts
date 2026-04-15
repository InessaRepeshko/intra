import { StrategicReportInsightDomain } from '../../domain/startegic-report-insight.domain';

export const STRATEGIC_REPORT_INSIGHT_REPOSITORY = Symbol(
    'REPORTING.STRATEGIC_REPORT_INSIGHT_REPOSITORY',
);

export interface StrategicReportInsightRepositoryPort {
    findByStrategicReportId(
        strategicReportId: number,
    ): Promise<StrategicReportInsightDomain[]>;
    findById(id: number): Promise<StrategicReportInsightDomain | null>;
    createMany(
        strategicReportId: number,
        insights: StrategicReportInsightDomain[],
    ): Promise<void>;
}
