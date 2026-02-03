export type AddReviewerPayload = {
    reviewId: number;
    reviewerId: number;
    fullName: string;
    positionId: number;
    positionTitle: string;
    teamId?: number | null;
    teamTitle?: string | null;
};
