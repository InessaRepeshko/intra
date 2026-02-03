import { SortDirection } from "../../../common/enums/sort-direction.enum";
import { CycleSortField } from "../../enums/cycle-sort-field.enum";
import { CycleStage } from "../../enums/cycle-stage.enum";

export type CycleSearchQuery = {
    title?: string;
    description?: string;
    search?: string;
    hrId?: number;
    minRespondentsThreshold?: number;
    stage?: CycleStage;
    isActive?: boolean;
    startDate?: Date;
    reviewDeadline?: Date;
    approvalDeadline?: Date;
    responseDeadline?: Date;
    endDate?: Date;
    sortBy?: CycleSortField;
    sortDirection?: SortDirection;
};
