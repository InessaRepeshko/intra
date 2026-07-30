import Decimal from 'decimal.js';
import { ClusterScoreDomain } from 'src/contexts/feedback360/domain/cluster-score.domain';

describe('ClusterScoreDomain', () => {
    const baseProps = {
        clusterId: 1,
        rateeId: 2,
        reviewId: 3,
        score: 4.25,
        answersCount: 6,
    };

    describe('create', () => {
        it('creates a cluster score with all supplied properties', () => {
            const score = ClusterScoreDomain.create({
                id: 10,
                ...baseProps,
                cycleId: 100,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            expect(score.id).toBe(10);
            expect(score.cycleId).toBe(100);
            expect(score.clusterId).toBe(1);
            expect(score.rateeId).toBe(2);
            expect(score.reviewId).toBe(3);
            expect(score.score).toBeInstanceOf(Decimal);
            expect(score.score.toNumber()).toBeCloseTo(4.25, 6);
            expect(score.answersCount).toBe(6);
            expect(score.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(score.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });

        it('coerces a numeric score input into a Decimal instance', () => {
            const score = ClusterScoreDomain.create({
                ...baseProps,
                score: 3,
            });
            expect(score.score).toBeInstanceOf(Decimal);
            expect(score.score.equals(new Decimal(3))).toBe(true);
        });

        it('accepts a string score input', () => {
            const score = ClusterScoreDomain.create({
                ...baseProps,
                score: '2.5',
            });
            expect(score.score.toString()).toBe('2.5');
        });

        it('defaults the cycleId to null when not provided', () => {
            const score = ClusterScoreDomain.create(baseProps);
            expect(score.cycleId).toBeNull();
        });
    });
});
