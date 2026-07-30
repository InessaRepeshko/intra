import '../../../setup-env';

import { ReviewStage } from '@intra/shared-kernel';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ClusterScoreAnalyticsService } from 'src/contexts/feedback360/application/services/cluster-score-analytics.service';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import { ReviewService } from 'src/contexts/feedback360/application/services/review.service';
import { ClusterScoreAnalyticsDomain } from 'src/contexts/feedback360/domain/cluster-score-analytics.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { ClusterService } from 'src/contexts/library/application/services/cluster.service';
import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('ClusterScoreAnalyticsService (integration)', () => {
    let module: TestingModule;
    let service: ClusterScoreAnalyticsService;
    let cycles: CycleService;
    let reviews: ReviewService;
    let reviewRepo: ReviewRepository;
    let competences: CompetenceService;
    let clusters: ClusterService;
    let positions: PositionService;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    let cycleId: number;
    let clusterId: number;
    let reviewId: number;
    let rateeId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        service = module.get(ClusterScoreAnalyticsService);
        cycles = module.get(CycleService);
        reviews = module.get(ReviewService);
        reviewRepo = module.get(ReviewRepository);
        competences = module.get(CompetenceService);
        clusters = module.get(ClusterService);
        positions = module.get(PositionService);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetFeedback360Tables(prisma);
        const hr = await identityUsers.create({
            firstName: 'Helena',
            lastName: 'Reed',
            email: `hr.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        const ratee = await identityUsers.create({
            firstName: 'Robert',
            lastName: 'Smith',
            email: `ratee.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        const position = await positions.create({ title: 'Engineer' });
        const cycle = await cycles.create({
            title: 'Cycle',
            hrId: hr.id!,
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-03-31'),
        } as any);
        const competence = await competences.create({ title: 'Teamwork' });
        const cluster = await clusters.create({
            competenceId: competence.id!,
            lowerBound: 0,
            upperBound: 5,
            title: 'Beginner',
            description: 'starting',
        } as any);
        // Reviews directly through repo so we don't have to drive the
        // full lifecycle just to attach cluster scores.
        const review = await reviewRepo.create(
            ReviewDomain.create({
                rateeId: ratee.id!,
                rateeFullName: 'Robert Smith',
                rateePositionId: position.id!,
                rateePositionTitle: 'Engineer',
                hrId: hr.id!,
                hrFullName: 'Helena Reed',
                cycleId: cycle.id!,
                stage: ReviewStage.FINISHED,
            }),
        );

        cycleId = cycle.id!;
        clusterId = cluster.id!;
        reviewId = review.id!;
        rateeId = ratee.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function buildPayload(
        overrides: Partial<{
            minScore: number;
            maxScore: number;
            averageScore: number;
            lowerBound: number;
            upperBound: number;
        }> = {},
    ): any {
        return {
            cycleId,
            clusterId,
            employeesCount: 5,
            employeeDensity: 0.5,
            lowerBound: overrides.lowerBound ?? 0,
            upperBound: overrides.upperBound ?? 5,
            minScore: overrides.minScore ?? 1,
            maxScore: overrides.maxScore ?? 5,
            averageScore: overrides.averageScore ?? 3,
        };
    }

    describe('upsert', () => {
        it('creates an analytics row when none exists for the (cycle, cluster)', async () => {
            const created = await service.upsert(buildPayload());

            expect(created.id).toBeDefined();
            expect(created.averageScore.toNumber()).toBe(3);
        });

        it('updates the existing row on the unique (cycleId, clusterId) pair', async () => {
            const first = await service.upsert(buildPayload());
            const second = await service.upsert(
                buildPayload({ averageScore: 4 }),
            );

            expect(second.id).toBe(first.id);
            expect(second.averageScore.toNumber()).toBe(4);
        });

        it('throws NotFoundException when the cycle does not exist', async () => {
            await expect(
                service.upsert({
                    ...buildPayload(),
                    cycleId: 999999,
                }),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('rejects bounds inverted (lower > upper)', async () => {
            await expect(
                service.upsert(buildPayload({ lowerBound: 4, upperBound: 1 })),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('rejects scores where min > max', async () => {
            await expect(
                service.upsert(buildPayload({ minScore: 5, maxScore: 1 })),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('rejects scores where avg lies outside [min, max]', async () => {
            await expect(
                service.upsert(
                    buildPayload({
                        minScore: 1,
                        maxScore: 3,
                        averageScore: 4.5,
                    }),
                ),
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });

    describe('getById / search / getByCycleId', () => {
        it('getById returns the row when found', async () => {
            const created = await service.upsert(buildPayload());

            await expect(service.getById(created.id!)).resolves.toBeInstanceOf(
                ClusterScoreAnalyticsDomain,
            );
        });

        it('getById throws NotFoundException when missing', async () => {
            await expect(service.getById(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('search filters by cycleId', async () => {
            await service.upsert(buildPayload());

            const result = await service.search({ cycleId } as any);
            expect(result).toHaveLength(1);
        });

        it('getByCycleId returns analytics tied to a cycle', async () => {
            await service.upsert(buildPayload());

            const result = await service.getByCycleId(cycleId);
            expect(result).toHaveLength(1);
        });
    });

    describe('update', () => {
        it('persists patched fields and re-runs score validation', async () => {
            const created = await service.upsert(buildPayload());

            const updated = await service.update(created.id!, {
                employeesCount: 10,
            } as any);

            expect(updated.employeesCount.toNumber()).toBe(10);
        });

        it('rejects a patch that breaks the min/avg/max invariant', async () => {
            const created = await service.upsert(buildPayload());

            await expect(
                service.update(created.id!, {
                    averageScore: 100,
                } as any),
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });

    describe('delete', () => {
        it('removes the analytics row', async () => {
            const created = await service.upsert(buildPayload());

            await service.delete(created.id!);

            await expect(service.getById(created.id!)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('generateAnalyticsForCycle', () => {
        it('aggregates cluster scores into analytics for every cluster with data', async () => {
            // Seed two cluster scores under the same cluster for different ratees.
            const secondRatee = await identityUsers.create({
                firstName: 'Alice',
                lastName: 'Stone',
                email: `alice.${Date.now()}.${Math.random()}@example.com`,
            } as any);

            await reviews.upsertClusterScore({
                cycleId,
                clusterId,
                rateeId,
                reviewId,
                score: 2,
                answersCount: 3,
            } as any);
            await reviews.upsertClusterScore({
                cycleId,
                clusterId,
                rateeId: secondRatee.id!,
                reviewId,
                score: 4,
                answersCount: 3,
            } as any);

            await service.generateAnalyticsForCycle(cycleId);

            const result = await service.getByCycleId(cycleId);
            expect(result).toHaveLength(1);
            expect(result[0].minScore.toNumber()).toBe(2);
            expect(result[0].maxScore.toNumber()).toBe(4);
            expect(result[0].averageScore.toNumber()).toBe(3);
            expect(result[0].employeesCount.toNumber()).toBe(2);
        });

        it('is a no-op when the cycle has no cluster scores', async () => {
            await service.generateAnalyticsForCycle(cycleId);

            const result = await service.getByCycleId(cycleId);
            expect(result).toEqual([]);
        });

        it('throws NotFoundException when the cycle does not exist', async () => {
            await expect(
                service.generateAnalyticsForCycle(999999),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });
});
