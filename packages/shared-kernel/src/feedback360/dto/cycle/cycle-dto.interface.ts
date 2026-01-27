import { CycleStage } from "../../enums/cycle-stage.enum";

export interface CycleDto {
    id: number;
    title: string;
    description?: string | null;
    hrId: number;
    minRespondentsThreshold: number;
    stage: CycleStage;
    isActive?: boolean;
    startDate: Date;
    reviewDeadline?: Date | null;
    approvalDeadline?: Date | null;
    responseDeadline?: Date | null;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}