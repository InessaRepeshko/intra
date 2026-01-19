import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  FEEDBACK360_CLUSTER_SCORE_REPOSITORY,
  Feedback360ClusterScoreRepositoryPort,
  Feedback360ClusterScoreSearchQuery,
} from '../../application/ports/feedback360-cluster-score.repository.port';
import { Feedback360ClusterScoreDomain } from '../../domain/feedback360-cluster-score.domain';
import { PerformanceMapper } from './performance.mapper';

@Injectable()
export class Feedback360ClusterScoreRepository implements Feedback360ClusterScoreRepositoryPort {
  readonly [FEEDBACK360_CLUSTER_SCORE_REPOSITORY] = FEEDBACK360_CLUSTER_SCORE_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async upsert(score: Feedback360ClusterScoreDomain): Promise<Feedback360ClusterScoreDomain> {
    const saved = await this.prisma.feedback360ClusterScore.upsert({
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
        feedback360Id: score.feedback360Id,
        score: score.score,
      },
      update: {
        cycleId: score.cycleId,
        feedback360Id: score.feedback360Id,
        score: score.score,
      },
    });

    return PerformanceMapper.toClusterScoreDomain(saved);
  }

  async list(query: Feedback360ClusterScoreSearchQuery): Promise<Feedback360ClusterScoreDomain[]> {
    const scores = await this.prisma.feedback360ClusterScore.findMany({
      where: {
        ...(query.cycleId ? { cycleId: query.cycleId } : {}),
        ...(query.clusterId ? { clusterId: query.clusterId } : {}),
        ...(query.userId ? { userId: query.userId } : {}),
        ...(query.feedback360Id ? { feedback360Id: query.feedback360Id } : {}),
      },
    });
    return scores.map(PerformanceMapper.toClusterScoreDomain);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.feedback360ClusterScore.delete({ where: { id } });
  }
}
