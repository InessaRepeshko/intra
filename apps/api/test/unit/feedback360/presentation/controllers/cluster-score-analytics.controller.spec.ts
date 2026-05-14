jest.mock('better-auth', () => ({ betterAuth: jest.fn(() => ({})) }));
jest.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: jest.fn(() => ({})),
}));

import Decimal from 'decimal.js';
import { ClusterScoreAnalyticsService } from 'src/contexts/feedback360/application/services/cluster-score-analytics.service';
import { ClusterScoreAnalyticsDomain } from 'src/contexts/feedback360/domain/cluster-score-analytics.domain';
import { ClusterScoreAnalyticsController } from 'src/contexts/feedback360/presentation/http/controllers/cluster-score-analytics.controller';

function buildAnalytics(): ClusterScoreAnalyticsDomain {
    return ClusterScoreAnalyticsDomain.create({
        id: 1,
        cycleId: 100,
        clusterId: 2,
        lowerBound: new Decimal(0),
        upperBound: new Decimal(5),
        employeesCount: new Decimal(12),
        employeeDensity: new Decimal('0.5'),
        minScore: new Decimal(1),
        maxScore: new Decimal(4),
        averageScore: new Decimal(2),
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    });
}

describe('ClusterScoreAnalyticsController', () => {
    let controller: ClusterScoreAnalyticsController;
    let analytics: any;

    beforeEach(() => {
        analytics = {
            upsert: jest.fn(),
            search: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getByCycleId: jest.fn(),
        };

        controller = new ClusterScoreAnalyticsController(
            analytics as unknown as ClusterScoreAnalyticsService,
        );
    });

    describe('upsert', () => {
        it('forwards every dto field and maps the response', async () => {
            analytics.upsert.mockResolvedValue(buildAnalytics());
            const dto = {
                cycleId: 100,
                clusterId: 2,
                lowerBound: 0,
                upperBound: 5,
                employeesCount: 12,
                employeeDensity: 0.5,
                minScore: 1,
                maxScore: 4,
                averageScore: 2,
            } as any;

            const result = await controller.upsert(dto);

            expect(analytics.upsert).toHaveBeenCalledWith({
                cycleId: 100,
                clusterId: 2,
                lowerBound: 0,
                upperBound: 5,
                employeesCount: 12,
                employeeDensity: 0.5,
                minScore: 1,
                maxScore: 4,
                averageScore: 2,
            });
            expect(result.id).toBe(1);
            expect(result.cycleId).toBe(100);
        });
    });

    describe('search', () => {
        it('maps each analytics row to a response', async () => {
            analytics.search.mockResolvedValue([buildAnalytics()]);
            const result = await controller.search({} as any);
            expect(analytics.search).toHaveBeenCalledWith({});
            expect(result).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('parses the id and calls the service', async () => {
            analytics.getById.mockResolvedValue(buildAnalytics());
            const result = await controller.getById('1');
            expect(analytics.getById).toHaveBeenCalledWith(1);
            expect(result.id).toBe(1);
        });
    });

    describe('update', () => {
        it('parses the id and forwards the patch', async () => {
            analytics.update.mockResolvedValue(buildAnalytics());
            const dto = { employeesCount: 20 } as any;

            const result = await controller.update('1', dto);

            expect(analytics.update).toHaveBeenCalledWith(1, dto);
            expect(result.id).toBe(1);
        });
    });

    describe('delete', () => {
        it('parses the id and calls the service', async () => {
            await controller.delete('1');
            expect(analytics.delete).toHaveBeenCalledWith(1);
        });
    });

    describe('getByCycleId', () => {
        it('maps each analytics row to a response', async () => {
            analytics.getByCycleId.mockResolvedValue([buildAnalytics()]);
            const result = await controller.getByCycleId('100');
            expect(analytics.getByCycleId).toHaveBeenCalledWith(100);
            expect(result).toHaveLength(1);
        });
    });
});
