import { SortDirection } from '../../../common/enums/sort-direction.enum';
import { StrategicReportAnalyticsSortField } from '../../enums/strategic-report-analytics-sort-field.enum';

export type StrategicReportAnalyticsSearchQuery = {
    reportId?: number;
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
    sortBy?: StrategicReportAnalyticsSortField;
    sortDirection?: SortDirection;
};
