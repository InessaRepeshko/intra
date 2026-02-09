import {
    Prisma,
    Cluster as PrismaCluster,
    ClusterScore as PrismaClusterScore,
    User as PrismaUser,
} from '@intra/database';
import Decimal from 'decimal.js';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { UserMapper } from 'src/contexts/identity/infrastructure/mappers/user.mapper';
import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';
import { ClusterScoreWithRelationsDomain } from '../../domain/cluster-score-with-relations.domain';
import { ClusterScoreDomain } from '../../domain/cluster-score.domain';

export class ClusterScoreMapper {
    static toDomain(score: PrismaClusterScore): ClusterScoreDomain {
        return ClusterScoreDomain.create({
            id: score.id,
            cycleId: score.cycleId,
            clusterId: score.clusterId,
            rateeId: score.rateeId,
            reviewId: score.reviewId,
            score: new Decimal(score.score),
            answersCount: score.answersCount,
            createdAt: score.createdAt,
            updatedAt: score.updatedAt,
        });
    }

    static toPrisma(
        score: ClusterScoreDomain,
    ): Prisma.ClusterScoreUncheckedCreateInput {
        return {
            cycleId: score.cycleId,
            clusterId: score.clusterId,
            rateeId: score.rateeId,
            reviewId: score.reviewId,
            score: ClusterScoreMapper.toScoreDecimalString(score.score),
            answersCount: score.answersCount,
        };
    }

    static toDomainWithRelations(
        score: PrismaClusterScore & {
            cluster: PrismaCluster;
            ratee: PrismaUser;
        },
    ): ClusterScoreWithRelationsDomain {
        return ClusterScoreWithRelationsDomain.create({
            id: score.id,
            cycleId: score.cycleId,
            clusterId: score.clusterId,
            rateeId: score.rateeId,
            reviewId: score.reviewId,
            score: new Decimal(score.score),
            answersCount: score.answersCount,
            createdAt: score.createdAt,
            updatedAt: score.updatedAt,
            cluster: ClusterDomain.create({
                id: score.cluster.id,
                competenceId: score.cluster.competenceId,
                lowerBound: new Decimal(score.cluster.lowerBound).toNumber(),
                upperBound: new Decimal(score.cluster.upperBound).toNumber(),
                title: score.cluster.title,
                description: score.cluster.description,
                createdAt: score.cluster.createdAt,
                updatedAt: score.cluster.updatedAt,
            }),
            ratee: UserDomain.create({
                id: score.ratee.id,
                firstName: score.ratee.firstName,
                secondName: score.ratee.secondName ?? undefined,
                lastName: score.ratee.lastName,
                fullName: score.ratee.fullName,
                email: score.ratee.email,
                avatarUrl: score.ratee.avatarUrl,
                status: UserMapper.toDomainStatus(score.ratee.status),
                positionId: score.ratee.positionId,
                teamId: score.ratee.teamId,
                managerId: score.ratee.managerId,
                createdAt: score.ratee.createdAt,
                updatedAt: score.ratee.updatedAt,
            }),
        });
    }

    static toScoreDecimalString(value: Decimal.Value): string {
        return new Decimal(value).toDecimalPlaces(4).toFixed(4);
    }
}
