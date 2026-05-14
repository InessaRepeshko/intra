import Decimal from 'decimal.js';
import { ClusterScoreAnalyticsDomain } from 'src/contexts/feedback360/domain/cluster-score-analytics.domain';
import { ClusterScoreAnalyticsHttpMapper } from 'src/contexts/feedback360/presentation/http/mappers/cluster-score-analytics.http.mapper';

describe('ClusterScoreAnalyticsHttpMapper', () => {
    describe('toResponse', () => {
        it('maps the domain into a response, rounding numeric fields to 4dp', () => {
            const domain = ClusterScoreAnalyticsDomain.create({
                id: 1,
                cycleId: 100,
                clusterId: 2,
                lowerBound: new Decimal(0),
                upperBound: new Decimal(5),
                employeesCount: new Decimal(12),
                employeeDensity: new Decimal('0.123456'),
                minScore: new Decimal('1.234567'),
                maxScore: new Decimal('4.876543'),
                averageScore: new Decimal('3.4'),
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            const response = ClusterScoreAnalyticsHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.cycleId).toBe(100);
            expect(response.clusterId).toBe(2);
            expect(response.lowerBound).toBe(0);
            expect(response.upperBound).toBe(5);
            expect(response.employeesCount).toBe(12);
            expect(response.employeeDensity).toBeCloseTo(0.1235, 4);
            expect(response.minScore).toBeCloseTo(1.2346, 4);
            expect(response.maxScore).toBeCloseTo(4.8765, 4);
            expect(response.averageScore).toBeCloseTo(3.4, 4);
            expect(response.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(response.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });
    });
});
