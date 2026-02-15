import { EntitySummaryMetricsDto } from '../entity-summary-metrics-dto.interface';

export interface ReportCompetenceSummaryDto extends EntitySummaryMetricsDto {
    competenceId: number;
    competenceTitle?: string | null;
}
