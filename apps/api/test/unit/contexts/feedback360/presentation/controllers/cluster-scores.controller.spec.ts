jest.mock('better-auth', () => ({ betterAuth: jest.fn(() => ({})) }));
jest.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: jest.fn(() => ({})),
}));

import { IdentityRole, IdentityStatus } from '@intra/shared-kernel';
import { ReviewService } from 'src/contexts/feedback360/application/services/review.service';
import { ClusterScoreWithRelationsDomain } from 'src/contexts/feedback360/domain/cluster-score-with-relations.domain';
import { ClusterScoreDomain } from 'src/contexts/feedback360/domain/cluster-score.domain';
import { ClusterScoresController } from 'src/contexts/feedback360/presentation/http/controllers/cluster-scores.controller';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';

function buildScore(): ClusterScoreDomain {
    return ClusterScoreDomain.create({
        id: 1,
        cycleId: 100,
        clusterId: 2,
        rateeId: 3,
        reviewId: 4,
        score: 3.5,
        answersCount: 5,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    });
}

function buildScoreWithRelations(): ClusterScoreWithRelationsDomain {
    return ClusterScoreWithRelationsDomain.create({
        id: 1,
        cycleId: 100,
        clusterId: 2,
        rateeId: 3,
        reviewId: 4,
        score: 3.5,
        answersCount: 5,
        cluster: ClusterDomain.create({
            id: 2,
            competenceId: 7,
            lowerBound: 0,
            upperBound: 5,
            title: 'Soft Skills',
            description: 'desc',
        }),
        ratee: UserDomain.create({
            id: 3,
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@example.com',
            status: IdentityStatus.ACTIVE,
            roles: [IdentityRole.EMPLOYEE],
            createdAt: new Date('2025-01-01T00:00:00.000Z'),
            updatedAt: new Date('2025-01-01T00:00:00.000Z'),
        }),
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    });
}

describe('ClusterScoresController', () => {
    let controller: ClusterScoresController;
    let reviews: any;

    beforeEach(() => {
        reviews = {
            upsertClusterScore: jest.fn(),
            listClusterScores: jest.fn(),
            getClusterScoreById: jest.fn(),
            removeClusterScore: jest.fn(),
            getClusterScoreByCycleId: jest.fn(),
        };

        controller = new ClusterScoresController(
            reviews as unknown as ReviewService,
        );
    });

    describe('upsert', () => {
        it('forwards the dto and returns a mapped response', async () => {
            reviews.upsertClusterScore.mockResolvedValue(buildScore());
            const dto = {
                cycleId: 100,
                clusterId: 2,
                rateeId: 3,
                reviewId: 4,
                score: 3.5,
            } as any;

            const result = await controller.upsert(dto);

            expect(reviews.upsertClusterScore).toHaveBeenCalledWith(dto);
            expect(result.id).toBe(1);
            expect(result.score).toBeCloseTo(3.5, 4);
        });
    });

    describe('list', () => {
        it('maps each score to a response', async () => {
            reviews.listClusterScores.mockResolvedValue([buildScore()]);
            const result = await controller.list({} as any);
            expect(reviews.listClusterScores).toHaveBeenCalledWith({});
            expect(result).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('returns the with-relations response', async () => {
            reviews.getClusterScoreById.mockResolvedValue(
                buildScoreWithRelations(),
            );

            const result = await controller.getById('1');

            expect(reviews.getClusterScoreById).toHaveBeenCalledWith(1);
            expect(result.cluster.title).toBe('Soft Skills');
            expect(result.ratee.fullName).toBe('Jane Doe');
        });
    });

    describe('delete', () => {
        it('parses the id and calls remove', async () => {
            await controller.delete('5');
            expect(reviews.removeClusterScore).toHaveBeenCalledWith(5);
        });
    });

    describe('getByCycleId', () => {
        it('maps every aggregate to a response', async () => {
            reviews.getClusterScoreByCycleId.mockResolvedValue([
                buildScoreWithRelations(),
            ]);

            const result = await controller.getByCycleId('100');

            expect(reviews.getClusterScoreByCycleId).toHaveBeenCalledWith(100);
            expect(result).toHaveLength(1);
            expect(result[0].cluster.id).toBe(2);
        });
    });
});
