import { SortDirection } from '../../../common/enums/sort-direction.enum';
import { CycleSortField } from '../../enums/cycle-sort-field.enum';
import { CycleStage } from '../../enums/cycle-stage.enum';

export type CycleSearchBaseQuery<TDate = Date> = {
    title?: string;
    description?: string;
    search?: string;
    hrId?: number;
    minRespondentsThreshold?: number;
    stage?: CycleStage;
    isActive?: boolean;
    startDate?: TDate;
    reviewDeadline?: TDate;
    approvalDeadline?: TDate;
    responseDeadline?: TDate;
    endDate?: TDate;
    sortBy?: CycleSortField;
    sortDirection?: SortDirection;
};

export type CycleSearchQuery = CycleSearchBaseQuery<Date>;

export type CycleFilterQuery = CycleSearchBaseQuery<string>;
