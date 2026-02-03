export interface ReviewerDto {
    id: number;
    reviewId: number;
    reviewerId: number;
    fullName: string;
    positionId: number;
    positionTitle: string;
    teamId?: number | null;
    teamTitle?: string | null;
    createdAt: Date;
}
