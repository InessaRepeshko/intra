import { Prisma } from '@intra/database';
import {
    ClusterScoreSearchQuery,
    ClusterScoreSortField,
    SortDirection,
} from '@intra/shared-kernel';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    CLUSTER_SCORE_REPOSITORY,
    ClusterScoreRepositoryPort,
} from '../../application/ports/cluster-score.repository.port';
import { ClusterScoreWithRelationsDomain } from '../../domain/cluster-score-with-relations.domain';
import { ClusterScoreDomain } from '../../domain/cluster-score.domain';
import { ClusterScoreMapper } from '../mappers/cluster-score.mapper';

@Injectable()
export class ClusterScoreRepository implements ClusterScoreRepositoryPort {
    readonly [CLUSTER_SCORE_REPOSITORY] = CLUSTER_SCORE_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async upsert(score: ClusterScoreDomain): Promise<ClusterScoreDomain> {
        const prismaScore = ClusterScoreMapper.toPrisma(score);
        const saved = await this.prisma.clusterScore.upsert({
            where: {
                clusterId_rateeId: {
                    clusterId: score.clusterId,
                    rateeId: score.rateeId,
                },
            },
            create: prismaScore,
            update: {
                cycleId: prismaScore.cycleId,
                reviewId: prismaScore.reviewId,
                score: prismaScore.score,
                answersCount: prismaScore.answersCount,
            },
        });

        return ClusterScoreMapper.toDomain(saved);
    }

    async list(query: ClusterScoreSearchQuery): Promise<ClusterScoreDomain[]> {
        const where = this.buildWhere(query);
        const orderBy = this.buildOrder(query);
        const scores = await this.prisma.clusterScore.findMany({
            where,
            orderBy,
        });
        return scores.map(ClusterScoreMapper.toDomain);
    }

    async getById(id: number): Promise<ClusterScoreWithRelationsDomain> {
        const score = await this.prisma.clusterScore.findUnique({
            where: { id },
            include: {
                cluster: true,
                ratee: true,
            },
        });
        if (!score) throw new NotFoundException('Cluster score not found');
        return ClusterScoreMapper.toDomainWithRelations(score);
    }

    async deleteById(id: number): Promise<void> {
        await this.prisma.clusterScore.delete({ where: { id } });
    }

    async getByCycleId(
        cycleId: number,
    ): Promise<ClusterScoreWithRelationsDomain[]> {
        const scores = await this.prisma.clusterScore.findMany({
            where: { cycleId },
            orderBy: [{ clusterId: 'asc' }, { score: 'asc' }],
            include: {
                cluster: true,
                ratee: true,
            },
        });
        return scores.map((s) => ClusterScoreMapper.toDomainWithRelations(s));
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
            ...(score !== undefined
                ? { score: ClusterScoreMapper.toScoreDecimalString(score) }
                : {}),
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
