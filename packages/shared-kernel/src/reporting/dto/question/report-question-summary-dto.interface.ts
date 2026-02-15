import { EntitySummaryMetricsDto } from '../entity-summary-metrics-dto.interface';

export interface ReportQuestionSummaryDto extends EntitySummaryMetricsDto {
    questionId: number;
    questionTitle?: string | null;
}
