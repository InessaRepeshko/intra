import {
    Cluster as PrismaCluster,
    ClusterScore as PrismaClusterScore,
    User as PrismaUser,
} from '@intra/database';
import Decimal from 'decimal.js';
import { ClusterScoreWithRelationsDomain } from 'src/contexts/feedback360/domain/cluster-score-with-relations.domain';
import { ClusterScoreDomain } from 'src/contexts/feedback360/domain/cluster-score.domain';
import { ClusterScoreMapper } from 'src/contexts/feedback360/infrastructure/mappers/cluster-score.mapper';

describe('ClusterScoreMapper', () => {
    const prismaClusterScore = {
        id: 1,
        cycleId: 100,
        clusterId: 2,
        rateeId: 11,
        reviewId: 5,
        score: '3.5000',
        answersCount: 4,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    } as unknown as PrismaClusterScore;

    describe('toDomain', () => {
        it('converts a prisma row into a ClusterScoreDomain instance', () => {
            const domain = ClusterScoreMapper.toDomain(prismaClusterScore);

            expect(domain).toBeInstanceOf(ClusterScoreDomain);
            expect(domain.id).toBe(1);
            expect(domain.cycleId).toBe(100);
            expect(domain.clusterId).toBe(2);
            expect(domain.rateeId).toBe(11);
            expect(domain.reviewId).toBe(5);
            expect(domain.score).toBeInstanceOf(Decimal);
            expect(domain.score.toNumber()).toBe(3.5);
            expect(domain.answersCount).toBe(4);
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain into a Prisma create input and rounds the score to 4dp', () => {
            const domain = ClusterScoreDomain.create({
                cycleId: 100,
                clusterId: 2,
                rateeId: 11,
                reviewId: 5,
                score: 3.456789,
                answersCount: 4,
            });

            const prisma = ClusterScoreMapper.toPrisma(domain);

            expect(prisma.cycleId).toBe(100);
            expect(prisma.clusterId).toBe(2);
            expect(prisma.score).toBe('3.4568');
            expect(prisma.answersCount).toBe(4);
        });
    });

    describe('toDomainWithRelations', () => {
        const prismaCluster = {
            id: 2,
            competenceId: 7,
            lowerBound: '0',
            upperBound: '5',
            title: 'Soft Skills',
            description: 'Communication & teamwork',
            createdAt: new Date('2025-01-01T00:00:00.000Z'),
            updatedAt: new Date('2025-01-01T00:00:00.000Z'),
        } as unknown as PrismaCluster;

        const prismaUser = {
            id: 11,
            firstName: 'Jane',
            secondName: null,
            lastName: 'Doe',
            fullName: 'Jane Doe',
            email: 'jane@example.com',
            avatarUrl: null,
            status: 'ACTIVE' as PrismaUser['status'],
            positionId: 3,
            teamId: 4,
            managerId: 5,
            createdAt: new Date('2025-01-01T00:00:00.000Z'),
            updatedAt: new Date('2025-01-01T00:00:00.000Z'),
        } as unknown as PrismaUser;

        it('returns the full aggregate including cluster and ratee', () => {
            const aggregate = ClusterScoreMapper.toDomainWithRelations({
                ...prismaClusterScore,
                cluster: prismaCluster,
                ratee: prismaUser,
            });

            expect(aggregate).toBeInstanceOf(ClusterScoreWithRelationsDomain);
            expect(aggregate.id).toBe(1);
            expect(aggregate.cluster.id).toBe(2);
            expect(aggregate.cluster.title).toBe('Soft Skills');
            expect(aggregate.cluster.lowerBound).toBe(0);
            expect(aggregate.cluster.upperBound).toBe(5);
            expect(aggregate.ratee.id).toBe(11);
            expect(aggregate.ratee.fullName).toBe('Jane Doe');
            expect(aggregate.ratee.email).toBe('jane@example.com');
        });
    });

    describe('toScoreDecimalString', () => {
        it('rounds to exactly 4 decimal places', () => {
            expect(ClusterScoreMapper.toScoreDecimalString(3.45678)).toBe(
                '3.4568',
            );
            expect(ClusterScoreMapper.toScoreDecimalString(3)).toBe('3.0000');
            expect(ClusterScoreMapper.toScoreDecimalString('2.1')).toBe(
                '2.1000',
            );
        });
    });
});
