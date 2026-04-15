import { EntityType } from '../../enums/entity-type.enum';
import { InsightType } from '../../enums/insight.enum';

export interface ReportInsightBaseDto<TDate = Date> {
    id: number;
    reportId: number;
    insightType: InsightType;
    entityType: EntityType;
    questionId: number | null;
    questionTitle: string | null;
    competenceId: number | null;
    competenceTitle: string | null;
    averageScore: number | null;
    averageRating: number | null;
    averageDelta: number | null;
    createdAt: TDate;
}

export type ReportInsightDto = ReportInsightBaseDto<Date>;

export type ReportInsightResponseDto = ReportInsightBaseDto<string>;
