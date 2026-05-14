import '../../../setup-env';

import { TestingModule } from '@nestjs/testing';
import { ClusterScoreAnalyticsDomain } from 'src/contexts/feedback360/domain/cluster-score-analytics.domain';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ClusterScoreAnalyticsRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cluster-score-analytics.repository';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { ClusterRepository } from 'src/contexts/library/infrastructure/prisma-repositories/cluster.repository';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('ClusterScoreAnalyticsRepository (integration)', () => {
    let module: TestingModule;
    let repo: ClusterScoreAnalyticsRepository;
    let cycles: CycleRepository;
    let competences: CompetenceRepository;
    let clusters: ClusterRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    let cycleId: number;
    let clusterId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        repo = module.get(ClusterScoreAnalyticsRepository);
        cycles = module.get(CycleRepository);
        competences = module.get(CompetenceRepository);
        clusters = module.get(ClusterRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetFeedback360Tables(prisma);
        const hr = await identityUsers.create({
            firstName: 'Helena',
            lastName: 'Reed',
            email: `hr.${Date.now()}@example.com`,
        } as any);
        const competence = await competences.create(
            CompetenceDomain.create({ title: 'Teamwork' }),
        );
        const cluster = await clusters.create(
            ClusterDomain.create({
                competenceId: competence.id!,
                lowerBound: 0,
                upperBound: 3,
                title: 'Beginner',
                description: '',
            }),
        );
        const cycle = await cycles.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hr.id!,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );

        cycleId = cycle.id!;
        clusterId = cluster.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function buildAnalytics(
        overrides: Partial<{
            averageScore: number;
            employeesCount: number;
        }> = {},
    ): ClusterScoreAnalyticsDomain {
        return ClusterScoreAnalyticsDomain.create({
            cycleId,
            clusterId,
            lowerBound: 0,
            upperBound: 3,
            employeesCount: overrides.employeesCount ?? 5,
            employeeDensity: 0.5,
            minScore: 1,
            maxScore: 4,
            averageScore: overrides.averageScore ?? 2.5,
        });
    }

    describe('upsert', () => {
        it('creates a new analytics row', async () => {
            const saved = await repo.upsert(buildAnalytics());

            expect(saved.id).toBeDefined();
            expect(saved.averageScore.toNumber()).toBe(2.5);
        });

        it('updates the existing row when (cycleId, clusterId) match', async () => {
            const first = await repo.upsert(buildAnalytics());
            const second = await repo.upsert(
                buildAnalytics({ averageScore: 3.7, employeesCount: 7 }),
            );

            expect(second.id).toBe(first.id);
            expect(second.averageScore.toNumber()).toBe(3.7);

            const rows = await prisma.clusterScoreAnalytics.findMany({
                where: { cycleId, clusterId },
            });
            expect(rows).toHaveLength(1);
        });
    });

    describe('findById', () => {
        it('returns the row when found', async () => {
            const saved = await repo.upsert(buildAnalytics());

            await expect(repo.findById(saved.id!)).resolves.toBeInstanceOf(
                ClusterScoreAnalyticsDomain,
            );
        });

        it('returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });

    describe('search', () => {
        it('filters by cycleId', async () => {
            await repo.upsert(buildAnalytics());

            const result = await repo.search({ cycleId } as any);

            expect(result).toHaveLength(1);
        });

        it('filters by clusterId', async () => {
            await repo.upsert(buildAnalytics());

            const result = await repo.search({ clusterId } as any);

            expect(result).toHaveLength(1);
        });
    });

    describe('updateById', () => {
        it('persists patched fields', async () => {
            const saved = await repo.upsert(buildAnalytics());

            const updated = await repo.updateById(saved.id!, {
                employeesCount: 10,
            } as any);

            expect(updated.employeesCount.toNumber()).toBe(10);
        });
    });

    describe('getByCycleId', () => {
        it('returns analytics tied to a cycle', async () => {
            await repo.upsert(buildAnalytics());

            const result = await repo.getByCycleId(cycleId);

            expect(result).toHaveLength(1);
        });
    });

    describe('deleteById', () => {
        it('removes the row', async () => {
            const saved = await repo.upsert(buildAnalytics());

            await repo.deleteById(saved.id!);

            const fromDb = await prisma.clusterScoreAnalytics.findUnique({
                where: { id: saved.id! },
            });
            expect(fromDb).toBeNull();
        });
    });
});
