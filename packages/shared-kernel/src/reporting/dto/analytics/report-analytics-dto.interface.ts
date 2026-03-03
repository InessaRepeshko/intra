import { EntityType } from '../../enums/entity-type.enum';

export interface ReportAnalyticsBaseDto<TDate = Date> {
    id: number;
    reportId: number;
    entityType: EntityType;
    questionId?: number | null;
    questionTitle?: string | null;
    competenceId?: number | null;
    competenceTitle?: string | null;
    averageBySelfAssessment?: number | null;
    averageByTeam?: number | null;
    averageByOther?: number | null;
    percentageBySelfAssessment?: number | null;
    percentageByTeam?: number | null;
    percentageByOther?: number | null;
    deltaPercentageByTeam?: number | null;
    deltaPercentageByOther?: number | null;
    createdAt: TDate;
}

export type ReportAnalyticsDto = ReportAnalyticsBaseDto<Date>;

export type ReportAnalyticsResponseDto = ReportAnalyticsBaseDto<string>;
