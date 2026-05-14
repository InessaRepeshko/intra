import { IdentityRole, IdentityStatus } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { ClusterScoreWithRelationsDomain } from 'src/contexts/feedback360/domain/cluster-score-with-relations.domain';
import { ClusterScoreDomain } from 'src/contexts/feedback360/domain/cluster-score.domain';
import { ClusterScoreHttpMapper } from 'src/contexts/feedback360/presentation/http/mappers/cluster-score.http.mapper';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';

describe('ClusterScoreHttpMapper', () => {
    describe('toResponse', () => {
        it('maps the domain fields and rounds score to 4dp', () => {
            const domain = ClusterScoreDomain.create({
                id: 1,
                cycleId: 100,
                clusterId: 2,
                rateeId: 3,
                reviewId: 4,
                score: 3.456789,
                answersCount: 5,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            const response = ClusterScoreHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.cycleId).toBe(100);
            expect(response.clusterId).toBe(2);
            expect(response.rateeId).toBe(3);
            expect(response.reviewId).toBe(4);
            expect(response.score).toBeCloseTo(3.4568, 4);
            expect(response.answersCount).toBe(5);
        });

        it('emits null cycleId when missing', () => {
            const domain = ClusterScoreDomain.create({
                id: 1,
                clusterId: 2,
                rateeId: 3,
                reviewId: 4,
                score: 1,
                answersCount: 1,
            });

            const response = ClusterScoreHttpMapper.toResponse(domain);
            expect(response.cycleId).toBeNull();
        });
    });

    describe('toResponseWithRelations', () => {
        it('includes the cluster and ratee in the response', () => {
            const cluster = ClusterDomain.create({
                id: 2,
                competenceId: 7,
                lowerBound: 0,
                upperBound: 5,
                title: 'Soft Skills',
                description: 'Communication',
            });

            const ratee = UserDomain.create({
                id: 11,
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                status: IdentityStatus.ACTIVE,
                roles: [IdentityRole.EMPLOYEE],
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            const aggregate = ClusterScoreWithRelationsDomain.create({
                id: 1,
                cycleId: 100,
                clusterId: cluster.id!,
                rateeId: ratee.id!,
                reviewId: 4,
                score: 3.5,
                answersCount: 5,
                cluster,
                ratee,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            const response =
                ClusterScoreHttpMapper.toResponseWithRelations(aggregate);

            expect(response.cluster.id).toBe(2);
            expect(response.cluster.title).toBe('Soft Skills');
            expect(response.ratee.id).toBe(11);
            expect(response.ratee.fullName).toBe('Jane Doe');
            expect(response.score).toBeCloseTo(3.5, 4);
        });
    });

    describe('toScoreRoundedNumber', () => {
        it('rounds a Decimal to a 4-decimal-place number', () => {
            expect(
                ClusterScoreHttpMapper.toScoreRoundedNumber(
                    new Decimal('3.456789'),
                ),
            ).toBeCloseTo(3.4568, 4);
        });

        it('rounds a plain number to a 4-decimal-place number', () => {
            expect(ClusterScoreHttpMapper.toScoreRoundedNumber(2.5)).toBe(2.5);
        });

        it('returns null when the input is null or undefined', () => {
            expect(
                ClusterScoreHttpMapper.toScoreRoundedNumber(null),
            ).toBeNull();
            expect(
                ClusterScoreHttpMapper.toScoreRoundedNumber(undefined),
            ).toBeNull();
        });
    });
});
