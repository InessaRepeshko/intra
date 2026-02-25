import { ReviewStage } from '../../enums/review-stage.enum';

export interface ReviewBaseDto<TDate = Date> {
    id: number;
    rateeId: number;
    rateeFullName: string;
    rateePositionId: number;
    rateePositionTitle: string;
    hrId: number;
    hrFullName: string;
    hrNote?: string | null;
    teamId?: number | null;
    teamTitle?: string | null;
    managerId?: number | null;
    managerFullName?: string | null;
    managerPositionId?: number | null;
    managerPositionTitle?: string | null;
    cycleId?: number | null;
    stage: ReviewStage;
    reportId?: number | null;
    createdAt: TDate;
    updatedAt: TDate;
}

export type ReviewDto = ReviewBaseDto<Date>;

export type ReviewResponseDto = ReviewBaseDto<string>;
