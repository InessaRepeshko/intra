export interface ReviewerBaseDto<TDate = Date> {
    id: number;
    reviewId: number;
    reviewerId: number;
    fullName: string;
    positionId: number;
    positionTitle: string;
    teamId?: number | null;
    teamTitle?: string | null;
    createdAt: TDate;
}

export type ReviewerDto = ReviewerBaseDto<Date>;

export type ReviewerResponseDto = ReviewerBaseDto<string>;
