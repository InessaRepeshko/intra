import { ClusterScoreAnalytics as PrismaClusterScoreAnalytics } from '@intra/database';
import Decimal from 'decimal.js';
import { ClusterScoreAnalyticsDomain } from 'src/contexts/feedback360/domain/cluster-score-analytics.domain';
import { ClusterScoreAnalyticsMapper } from 'src/contexts/feedback360/infrastructure/mappers/cluster-score-analytics.mapper';

describe('ClusterScoreAnalyticsMapper', () => {
    const prismaRow = {
        id: 1,
        cycleId: 100,
        clusterId: 2,
        employeesCount: '12.0000',
        employeeDensity: '0.7500',
        lowerBound: '0.0000',
        upperBound: '5.0000',
        minScore: '1.5000',
        maxScore: '4.8000',
        averageScore: '3.4000',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    } as unknown as PrismaClusterScoreAnalytics;

    describe('toDomain', () => {
        it('converts the row to a ClusterScoreAnalyticsDomain with Decimal values', () => {
            const domain = ClusterScoreAnalyticsMapper.toDomain(prismaRow);

            expect(domain).toBeInstanceOf(ClusterScoreAnalyticsDomain);
            expect(domain.id).toBe(1);
            expect(domain.cycleId).toBe(100);
            expect(domain.clusterId).toBe(2);
            expect(domain.employeesCount.toNumber()).toBe(12);
            expect(domain.employeeDensity.toNumber()).toBeCloseTo(0.75, 6);
            expect(domain.lowerBound.toNumber()).toBe(0);
            expect(domain.upperBound.toNumber()).toBe(5);
            expect(domain.minScore.toNumber()).toBeCloseTo(1.5, 6);
            expect(domain.maxScore.toNumber()).toBeCloseTo(4.8, 6);
            expect(domain.averageScore.toNumber()).toBeCloseTo(3.4, 6);
        });
    });

    describe('toPrisma', () => {
        it('renders all numeric fields as 4-decimal-place strings', () => {
            const domain = ClusterScoreAnalyticsDomain.create({
                cycleId: 100,
                clusterId: 2,
                employeesCount: new Decimal(12),
                employeeDensity: new Decimal(0.75),
                lowerBound: new Decimal(0),
                upperBound: new Decimal(5),
                minScore: new Decimal(1.5),
                maxScore: new Decimal(4.8),
                averageScore: new Decimal(3.4),
            });

            const prisma = ClusterScoreAnalyticsMapper.toPrisma(domain);

            expect(prisma.cycleId).toBe(100);
            expect(prisma.clusterId).toBe(2);
            expect(prisma.employeesCount).toBe('12.0000');
            expect(prisma.employeeDensity).toBe('0.7500');
            expect(prisma.lowerBound).toBe('0.0000');
            expect(prisma.upperBound).toBe('5.0000');
            expect(prisma.minScore).toBe('1.5000');
            expect(prisma.maxScore).toBe('4.8000');
            expect(prisma.averageScore).toBe('3.4000');
        });
    });
});
