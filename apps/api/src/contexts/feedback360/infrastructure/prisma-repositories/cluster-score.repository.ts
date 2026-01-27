import { Prisma } from '@intra/database';
import {
    ClusterScoreSearchQuery,
    ClusterScoreSortField,
    SortDirection,
} from '@intra/shared-kernel';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    CLUSTER_SCORE_REPOSITORY,
    ClusterScoreRepositoryPort,
} from '../../application/ports/cluster-score.repository.port';
import { ClusterScoreDomain } from '../../domain/cluster-score.domain';
import { Feedback360Mapper } from './feedback360.mapper';

@Injectable()
export class ClusterScoreRepository implements ClusterScoreRepositoryPort {
    readonly [CLUSTER_SCORE_REPOSITORY] = CLUSTER_SCORE_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async upsert(score: ClusterScoreDomain): Promise<ClusterScoreDomain> {
        const saved = await this.prisma.clusterScore.upsert({
            where: {
                clusterId_rateeId: {
                    clusterId: score.clusterId,
                    rateeId: score.rateeId,
                },
            },
            create: {
                cycleId: score.cycleId,
                clusterId: score.clusterId,
                rateeId: score.rateeId,
                reviewId: score.reviewId,
                score: score.score,
                answersCount: score.answersCount,
            },
            update: {
                cycleId: score.cycleId,
                reviewId: score.reviewId,
                score: score.score,
                answersCount: score.answersCount,
            },
        });

        return Feedback360Mapper.toClusterScoreDomain(saved);
    }

    async list(query: ClusterScoreSearchQuery): Promise<ClusterScoreDomain[]> {
        const where = this.buildWhere(query);
        const orderBy = this.buildOrder(query);
        const scores = await this.prisma.clusterScore.findMany({
            where,
            orderBy,
        });
        return scores.map(Feedback360Mapper.toClusterScoreDomain);
    }

    async deleteById(id: number): Promise<void> {
        await this.prisma.clusterScore.delete({ where: { id } });
    }

    private buildWhere(
        query: ClusterScoreSearchQuery,
    ): Prisma.ClusterScoreWhereInput {
        const { cycleId, clusterId, rateeId, reviewId, score, answerCount } =
            query;
        return {
            ...(cycleId ? { cycleId } : {}),
            ...(clusterId ? { clusterId } : {}),
            ...(rateeId ? { rateeId } : {}),
            ...(reviewId ? { reviewId } : {}),
            ...(score ? { score } : {}),
            ...(answerCount ? { answerCount } : {}),
        };
    }

    private buildOrder(
        query: ClusterScoreSearchQuery,
    ): Prisma.ClusterScoreOrderByWithRelationInput[] {
        const field = query.sortBy ?? ClusterScoreSortField.ID;
        const direction = query.sortDirection ?? SortDirection.ASC;
        return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
    }
}
