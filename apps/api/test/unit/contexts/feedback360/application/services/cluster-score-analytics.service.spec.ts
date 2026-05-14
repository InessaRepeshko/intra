import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import Decimal from 'decimal.js';
import { CLUSTER_SCORE_ANALYTICS_REPOSITORY } from 'src/contexts/feedback360/application/ports/cluster-score-analytics.repository.port';
import { CLUSTER_SCORE_REPOSITORY } from 'src/contexts/feedback360/application/ports/cluster-score.repository.port';
import { ClusterScoreAnalyticsService } from 'src/contexts/feedback360/application/services/cluster-score-analytics.service';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import { ClusterScoreAnalyticsDomain } from 'src/contexts/feedback360/domain/cluster-score-analytics.domain';
import { ClusterScoreDomain } from 'src/contexts/feedback360/domain/cluster-score.domain';
import { ClusterService } from 'src/contexts/library/application/services/cluster.service';
import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';

function buildCluster(id: number, competenceId: number): ClusterDomain {
    return ClusterDomain.create({
        id,
        competenceId,
        lowerBound: 0,
        upperBound: 5,
        title: `Cluster ${id}`,
        description: 'desc',
    });
}

function buildClusterScore(
    clusterId: number,
    rateeId: number,
    score: number | string,
): ClusterScoreDomain {
    return ClusterScoreDomain.create({
        cycleId: 100,
        clusterId,
        rateeId,
        reviewId: rateeId,
        score,
        answersCount: 1,
    });
}

describe('ClusterScoreAnalyticsService', () => {
    let service: ClusterScoreAnalyticsService;
    let analytics: any;
    let clusterScores: any;
    let cycles: any;
    let clusters: any;

    beforeEach(async () => {
        analytics = {
            upsert: jest.fn(),
            search: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
            getByCycleId: jest.fn(),
        };
        clusterScores = { list: jest.fn() };
        cycles = { getById: jest.fn() };
        clusters = { search: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                ClusterScoreAnalyticsService,
                {
                    provide: CLUSTER_SCORE_ANALYTICS_REPOSITORY,
                    useValue: analytics,
                },
                {
                    provide: CLUSTER_SCORE_REPOSITORY,
                    useValue: clusterScores,
                },
                { provide: CycleService, useValue: cycles },
                { provide: ClusterService, useValue: clusters },
            ],
        }).compile();

        service = module.get(ClusterScoreAnalyticsService);
    });

    describe('upsert', () => {
        const baseInput = {
            cycleId: 100,
            clusterId: 2,
            employeesCount: 12,
            employeeDensity: 0.5,
            lowerBound: 0,
            upperBound: 5,
            minScore: 1,
            maxScore: 4,
            averageScore: 2.5,
        };

        it('verifies the cycle exists before validating and upserting', async () => {
            analytics.upsert.mockImplementation(
                async (d: ClusterScoreAnalyticsDomain) => d,
            );

            await service.upsert(baseInput);

            expect(cycles.getById).toHaveBeenCalledWith(100);
            expect(analytics.upsert).toHaveBeenCalledTimes(1);
            const domain = analytics.upsert.mock.calls[0][0];
            expect(domain).toBeInstanceOf(ClusterScoreAnalyticsDomain);
            expect(domain.minScore.toNumber()).toBe(1);
            expect(domain.maxScore.toNumber()).toBe(4);
        });

        it('throws when min score exceeds max score', async () => {
            await expect(
                service.upsert({
                    ...baseInput,
                    minScore: 5,
                    maxScore: 1,
                    averageScore: 3,
                }),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('throws when the average is outside [min, max]', async () => {
            await expect(
                service.upsert({
                    ...baseInput,
                    minScore: 1,
                    maxScore: 4,
                    averageScore: 5,
                }),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('throws when the lower bound is below the score minimum', async () => {
            await expect(
                service.upsert({ ...baseInput, lowerBound: -1 }),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('throws when the upper bound exceeds the score maximum', async () => {
            await expect(
                service.upsert({ ...baseInput, upperBound: 6 }),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('throws when the lower bound exceeds the upper bound', async () => {
            await expect(
                service.upsert({
                    ...baseInput,
                    lowerBound: 4,
                    upperBound: 2,
                }),
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });

    describe('search', () => {
        it('delegates to the analytics repository', async () => {
            analytics.search.mockResolvedValue([]);
            await service.search({});
            expect(analytics.search).toHaveBeenCalledWith({});
        });
    });

    describe('getById', () => {
        it('throws NotFoundException when missing', async () => {
            analytics.findById.mockResolvedValue(null);
            await expect(service.getById(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('returns the row when present', async () => {
            const row = { id: 1 } as any;
            analytics.findById.mockResolvedValue(row);
            await expect(service.getById(1)).resolves.toBe(row);
        });
    });

    describe('update', () => {
        it('validates the merged min/max/avg against existing values', async () => {
            const current = ClusterScoreAnalyticsDomain.create({
                id: 1,
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
            analytics.findById.mockResolvedValue(current);

            await expect(
                service.update(1, { minScore: 5 }),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('forwards only defined patch fields to updateById', async () => {
            const current = ClusterScoreAnalyticsDomain.create({
                id: 1,
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
            analytics.findById.mockResolvedValue(current);
            analytics.updateById.mockResolvedValue(current);

            await service.update(1, { employeesCount: 20 });
            expect(analytics.updateById).toHaveBeenCalledWith(1, {
                employeesCount: 20,
            });
        });
    });

    describe('delete', () => {
        it('throws NotFoundException when missing', async () => {
            analytics.findById.mockResolvedValue(null);
            await expect(service.delete(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
            expect(analytics.deleteById).not.toHaveBeenCalled();
        });

        it('deletes when present', async () => {
            analytics.findById.mockResolvedValue({ id: 1 });
            await service.delete(1);
            expect(analytics.deleteById).toHaveBeenCalledWith(1);
        });
    });

    describe('getByCycleId', () => {
        it('delegates to the analytics repository', async () => {
            analytics.getByCycleId.mockResolvedValue([]);
            await service.getByCycleId(100);
            expect(analytics.getByCycleId).toHaveBeenCalledWith(100);
        });
    });

    describe('generateAnalyticsForCycle', () => {
        it('computes min/max/average and employee density per cluster', async () => {
            cycles.getById.mockResolvedValue({ id: 100 });
            clusters.search.mockResolvedValue([
                buildCluster(1, 10),
                buildCluster(2, 10),
            ]);
            clusterScores.list.mockResolvedValue([
                buildClusterScore(1, 100, 4),
                buildClusterScore(1, 101, 2),
                buildClusterScore(2, 100, 3),
            ]);
            analytics.upsert.mockImplementation(
                async (d: ClusterScoreAnalyticsDomain) => d,
            );

            await service.generateAnalyticsForCycle(100);

            // Two clusters with scores → two upserts
            expect(analytics.upsert).toHaveBeenCalledTimes(2);
            const cluster1 = analytics.upsert.mock.calls[0][0];
            expect(cluster1.minScore.toNumber()).toBe(2);
            expect(cluster1.maxScore.toNumber()).toBe(4);
            expect(cluster1.averageScore.toNumber()).toBe(3);
            // 2 scores for cluster1 / 2 distinct ratees in competence 10 = 1
            expect(cluster1.employeeDensity.toNumber()).toBe(1);
            expect(cluster1.employeesCount.toNumber()).toBe(2);
        });

        it('skips clusters with no scores', async () => {
            cycles.getById.mockResolvedValue({ id: 100 });
            clusters.search.mockResolvedValue([buildCluster(1, 10)]);
            clusterScores.list.mockResolvedValue([]);

            await service.generateAnalyticsForCycle(100);

            expect(analytics.upsert).not.toHaveBeenCalled();
        });

        it('validates bounds and scores per cluster and surfaces the error', async () => {
            cycles.getById.mockResolvedValue({ id: 100 });
            clusters.search.mockResolvedValue([
                ClusterDomain.create({
                    id: 1,
                    competenceId: 10,
                    lowerBound: -1, // invalid
                    upperBound: 5,
                    title: 'C',
                    description: 'desc',
                }),
            ]);
            clusterScores.list.mockResolvedValue([
                buildClusterScore(1, 100, 4),
            ]);

            await expect(
                service.generateAnalyticsForCycle(100),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('rounds scores to 4 decimal places when aggregating', async () => {
            cycles.getById.mockResolvedValue({ id: 100 });
            clusters.search.mockResolvedValue([buildCluster(1, 10)]);
            clusterScores.list.mockResolvedValue([
                buildClusterScore(1, 100, '1.111111'),
                buildClusterScore(1, 101, '2.222222'),
                buildClusterScore(1, 102, '3.333333'),
            ]);
            analytics.upsert.mockImplementation(
                async (d: ClusterScoreAnalyticsDomain) => d,
            );

            await service.generateAnalyticsForCycle(100);

            const passed = analytics.upsert.mock.calls[0][0];
            // (1.111111 + 2.222222 + 3.333333) / 3 = 2.222222 → 4dp = 2.2222
            expect(passed.averageScore.equals(new Decimal('2.2222'))).toBe(
                true,
            );
            expect(passed.minScore.equals(new Decimal('1.1111'))).toBe(true);
            expect(passed.maxScore.equals(new Decimal('3.3333'))).toBe(true);
        });
    });
});
