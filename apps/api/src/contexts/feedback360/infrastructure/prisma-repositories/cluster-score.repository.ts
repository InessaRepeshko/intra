import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  CLUSTER_SCORE_REPOSITORY,
  ClusterScoreRepositoryPort,
  ClusterScoreSearchQuery,
} from '../../application/ports/cluster-score.repository.port';
import { ClusterScoreDomain } from '../../domain/cluster-score.domain';
import { Feedback360Mapper } from './feedback360.mapper';

@Injectable()
export class ClusterScoreRepository implements ClusterScoreRepositoryPort {
  readonly [CLUSTER_SCORE_REPOSITORY] = CLUSTER_SCORE_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async upsert(score: ClusterScoreDomain): Promise<ClusterScoreDomain> {
    const saved = await this.prisma.clusterScore.upsert({
      where: {
        clusterId_userId: {
          clusterId: score.clusterId,
          userId: score.userId,
        },
      },
      create: {
        cycleId: score.cycleId,
        clusterId: score.clusterId,
        userId: score.userId,
        reviewId: score.reviewId,
        score: score.score,
      },
      update: {
        cycleId: score.cycleId,
        reviewId: score.reviewId,
        score: score.score,
      },
    });

    return Feedback360Mapper.toClusterScoreDomain(saved);
  }

  async list(query: ClusterScoreSearchQuery): Promise<ClusterScoreDomain[]> {
    const scores = await this.prisma.clusterScore.findMany({
      where: {
        ...(query.cycleId ? { cycleId: query.cycleId } : {}),
        ...(query.clusterId ? { clusterId: query.clusterId } : {}),
        ...(query.userId ? { userId: query.userId } : {}),
        ...(query.reviewId ? { reviewId: query.reviewId } : {}),
      },
    });
    return scores.map(Feedback360Mapper.toClusterScoreDomain);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.clusterScore.delete({ where: { id } });
  }
}
