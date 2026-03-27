import { StrategicReportSearchQuery } from '@intra/shared-kernel';
import { StrategicReportDomain } from '../../domain/strategic-report.domain';

export const STRATEGIC_REPORT_REPOSITORY = Symbol(
    'REPORTING.STRATEGIC_REPORT_REPOSITORY',
);

export interface StrategicReportRepositoryPort {
    create(report: StrategicReportDomain): Promise<StrategicReportDomain>;
    findById(id: number): Promise<StrategicReportDomain | null>;
    findByCycleId(cycleId: number): Promise<StrategicReportDomain | null>;
    search(query: StrategicReportSearchQuery): Promise<StrategicReportDomain[]>;
}
