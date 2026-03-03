import { EntityType } from 'src/reporting/enums/entity-type.enum';
import { SortDirection } from '../../../common/enums/sort-direction.enum';
import { ReportAnalyticsSortField } from '../../enums/report-analytics-sort-field.enum';

export type ReportAnalyticsSearchQuery = {
    reportId?: number;
    entityType?: EntityType;
    questionId?: number;
    questionTitle?: string;
    competenceId?: number;
    competenceTitle?: string;
    averageBySelfAssessment?: number;
    averageByTeam?: number;
    averageByOther?: number;
    percentageBySelfAssessment?: number;
    percentageByTeam?: number;
    percentageByOther?: number;
    deltaPercentageByTeam?: number;
    deltaPercentageByOther?: number;
    createdAt?: Date;
    sortBy?: ReportAnalyticsSortField;
    sortDirection?: SortDirection;
};
