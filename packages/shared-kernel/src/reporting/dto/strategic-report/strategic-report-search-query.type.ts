import { SortDirection } from '../../../common/enums/sort-direction.enum';
import { StrategicReportSortField } from '../../enums/strategic-report-sort-field.enum';

export type StrategicReportSearchQuery = {
    cycleId?: number;
    cycleTitle?: string;
    rateeCount?: number;
    respondentCount?: number;
    answerCount?: number;
    reviewerCount?: number;
    teamCount?: number;
    positionCount?: number;
    competenceCount?: number;
    questionCount?: number;
    turnoutPctOfRatees?: number;
    turnoutPctOfRespondents?: number;
    competenceGeneralAvgSelf?: number;
    competenceGeneralAvgTeam?: number;
    competenceGeneralAvgOther?: number;
    competenceGeneralPctSelf?: number;
    competenceGeneralPctTeam?: number;
    competenceGeneralPctOther?: number;
    competenceGeneralDeltaTeam?: number;
    competenceGeneralDeltaOther?: number;
    createdAt?: Date;
    sortBy?: StrategicReportSortField;
    sortDirection?: SortDirection;
};
