export interface ClusterScoreBaseDto<TDate = Date> {
    id: number;
    cycleId?: number | null;
    clusterId: number;
    rateeId: number;
    reviewId: number;
    score: number;
    answersCount: number;
    createdAt: TDate;
    updatedAt: TDate;
}

export type ClusterScoreDto = ClusterScoreBaseDto<Date>;

export type ClusterScoreResponseDto = ClusterScoreBaseDto<string>;
