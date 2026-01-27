import { ReviewStage } from "../../enums/review-stage.enum";

export type CreateReviewPayload = {
    rateeId: number;
    rateeFullName: string,
    rateePositionId: number;
    rateePositionTitle: string;
    hrId: number;
    hrFullName: string,
    hrNote?: string;
    teamId?: number | null;
    teamTitle?: string | null;
    managerId?: number | null;
    managerFullName?: string | null,
    managerPositionId?: number | null,
    managerPositionTitle?: string | null,
    cycleId?: number | null;
    stage?: ReviewStage;
    reportId?: number | null;
};
