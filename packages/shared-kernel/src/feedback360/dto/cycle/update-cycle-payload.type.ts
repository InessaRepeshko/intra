import { CycleStage } from "../../enums/cycle-stage.enum";

export type UpdateCyclePayload = Partial<{
    title: string;
    description?: string;
    hrId: number;
    minRespondentsThreshold?: number;
    stage?: CycleStage;
    isActive?: boolean;
    startDate: Date;
    reviewDeadline?: Date;
    approvalDeadline?: Date;
    responseDeadline?: Date;
    endDate: Date;
}>;
