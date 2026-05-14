import Decimal from 'decimal.js';
import { ClusterScoreAnalyticsDomain } from 'src/contexts/feedback360/domain/cluster-score-analytics.domain';

describe('ClusterScoreAnalyticsDomain', () => {
    const baseProps = {
        cycleId: 1,
        clusterId: 2,
        lowerBound: 0,
        upperBound: 5,
        employeesCount: 12,
        employeeDensity: 0.75,
        minScore: 1.5,
        maxScore: 4.8,
        averageScore: 3.4,
    };

    describe('create', () => {
        it('creates analytics with Decimal-coerced numeric fields', () => {
            const analytics = ClusterScoreAnalyticsDomain.create({
                id: 100,
                ...baseProps,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            expect(analytics.id).toBe(100);
            expect(analytics.cycleId).toBe(1);
            expect(analytics.clusterId).toBe(2);
            expect(analytics.lowerBound).toBeInstanceOf(Decimal);
            expect(analytics.upperBound).toBeInstanceOf(Decimal);
            expect(analytics.employeesCount).toBeInstanceOf(Decimal);
            expect(analytics.employeeDensity).toBeInstanceOf(Decimal);
            expect(analytics.minScore).toBeInstanceOf(Decimal);
            expect(analytics.maxScore).toBeInstanceOf(Decimal);
            expect(analytics.averageScore).toBeInstanceOf(Decimal);

            expect(analytics.lowerBound.toNumber()).toBe(0);
            expect(analytics.upperBound.toNumber()).toBe(5);
            expect(analytics.employeesCount.toNumber()).toBe(12);
            expect(analytics.employeeDensity.toNumber()).toBeCloseTo(0.75, 6);
            expect(analytics.minScore.toNumber()).toBeCloseTo(1.5, 6);
            expect(analytics.maxScore.toNumber()).toBeCloseTo(4.8, 6);
            expect(analytics.averageScore.toNumber()).toBeCloseTo(3.4, 6);

            expect(analytics.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(analytics.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });

        it('accepts string numeric inputs and Decimal instances', () => {
            const analytics = ClusterScoreAnalyticsDomain.create({
                ...baseProps,
                lowerBound: '1.2',
                upperBound: new Decimal('4.4'),
            });

            expect(analytics.lowerBound.toString()).toBe('1.2');
            expect(analytics.upperBound.toString()).toBe('4.4');
        });

        it('omits id, createdAt and updatedAt when not provided', () => {
            const analytics = ClusterScoreAnalyticsDomain.create(baseProps);
            expect(analytics.id).toBeUndefined();
            expect(analytics.createdAt).toBeUndefined();
            expect(analytics.updatedAt).toBeUndefined();
        });
    });
});
