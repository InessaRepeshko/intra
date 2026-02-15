export type UpsertClusterScorePayload = {
    cycleId?: number | null;
    clusterId: number;
    rateeId: number;
    reviewId: number;
    score: number;
    answersCount?: number;
};
