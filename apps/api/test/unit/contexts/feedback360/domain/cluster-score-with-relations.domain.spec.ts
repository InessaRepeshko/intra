import { IdentityRole, IdentityStatus } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { ClusterScoreWithRelationsDomain } from 'src/contexts/feedback360/domain/cluster-score-with-relations.domain';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';

describe('ClusterScoreWithRelationsDomain', () => {
    const cluster = ClusterDomain.create({
        id: 1,
        competenceId: 2,
        lowerBound: 0,
        upperBound: 5,
        title: 'Soft Skills',
        description: 'Communication & teamwork',
    });

    const ratee = UserDomain.create({
        id: 42,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        status: IdentityStatus.ACTIVE,
        roles: [IdentityRole.EMPLOYEE],
    });

    describe('create', () => {
        it('builds the aggregate with cluster, ratee, and score relations', () => {
            const aggregate = ClusterScoreWithRelationsDomain.create({
                id: 10,
                cycleId: 100,
                clusterId: cluster.id!,
                rateeId: ratee.id!,
                reviewId: 5,
                score: 3.14,
                answersCount: 9,
                cluster,
                ratee,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            expect(aggregate.id).toBe(10);
            expect(aggregate.cycleId).toBe(100);
            expect(aggregate.clusterId).toBe(cluster.id);
            expect(aggregate.rateeId).toBe(ratee.id);
            expect(aggregate.reviewId).toBe(5);
            expect(aggregate.score).toBeInstanceOf(Decimal);
            expect(aggregate.score.toNumber()).toBeCloseTo(3.14, 6);
            expect(aggregate.answersCount).toBe(9);
            expect(aggregate.cluster).toBe(cluster);
            expect(aggregate.ratee).toBe(ratee);
        });

        it('defaults the cycleId to null when not provided', () => {
            const aggregate = ClusterScoreWithRelationsDomain.create({
                clusterId: 1,
                rateeId: 1,
                reviewId: 1,
                score: 1,
                answersCount: 1,
                cluster,
                ratee,
            });
            expect(aggregate.cycleId).toBeNull();
        });
    });
});
