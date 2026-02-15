import { EntityType } from '../../enums/entity-type.enum';

export interface ReportAnalyticsDto {
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
    createdAt: Date;
}
