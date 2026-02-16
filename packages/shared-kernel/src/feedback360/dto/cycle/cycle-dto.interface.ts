import { CycleStage } from '../../enums/cycle-stage.enum';

export interface CycleBaseDto<TDate = Date> {
    id: number;
    title: string;
    description?: string | null;
    hrId: number;
    minRespondentsThreshold: number;
    stage: CycleStage;
    isActive?: boolean;
    startDate: TDate;
    reviewDeadline?: TDate | null;
    approvalDeadline?: TDate | null;
    responseDeadline?: TDate | null;
    endDate: TDate;
    createdAt: TDate;
    updatedAt: TDate;
}

export type CycleDto = CycleBaseDto<Date>;

export type CycleResponseDto = CycleBaseDto<string>;
