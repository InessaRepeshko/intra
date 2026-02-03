export interface ClusterScoreDto {
  id: number;
  cycleId?: number | null;
  clusterId: number;
  rateeId: number;
  reviewId: number;
  score: number;
  answersCount: number;
  createdAt: Date;
  updatedAt: Date;
}