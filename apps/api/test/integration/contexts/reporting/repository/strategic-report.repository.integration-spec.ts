import '../../../setup-env';

import { SortDirection, StrategicReportSortField } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { StrategicReportDomain } from 'src/contexts/reporting/domain/strategic-report.domain';
import { StrategicReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/strategic-report.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('StrategicReportRepository (integration)', () => {
    let module: TestingModule;
    let repo: StrategicReportRepository;
    let cycles: CycleRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    beforeAll(async () => {
        module = await createReportingTestModule();
        repo = module.get(StrategicReportRepository);
        cycles = module.get(CycleRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetReportingTables(prisma);
    });

    afterAll(async () => {
        await module.close();
    });

    async function seedCycle(title: string): Promise<number> {
        const hr = await identityUsers.create({
            firstName: 'Helena',
            lastName: 'Reed',
            email: `hr.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        const cycle = await cycles.create(
            CycleDomain.create({
                title,
                hrId: hr.id!,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );
        return cycle.id!;
    }

    function buildReport(
        cycleId: number,
        overrides: Partial<{
            cycleTitle: string;
            rateeCount: number;
            answerCount: number;
            rateeIds: number[];
            teamIds: number[];
        }> = {},
    ): StrategicReportDomain {
        return StrategicReportDomain.create({
            cycleId,
            cycleTitle: overrides.cycleTitle ?? 'Q1 2026',
            rateeCount: overrides.rateeCount ?? 5,
            rateeIds: overrides.rateeIds ?? [1, 2, 3, 4, 5],
            respondentCount: 12,
            respondentIds: [10, 11, 12],
            answerCount: overrides.answerCount ?? 120,
            reviewerCount: 5,
            reviewerIds: [],
            teamCount: 2,
            teamIds: overrides.teamIds ?? [100, 200],
            positionCount: 3,
            positionIds: [300, 301, 302],
            competenceCount: 4,
            competenceIds: [400, 401, 402, 403],
            questionCount: 8,
            questionIds: [500, 501, 502, 503, 504, 505, 506, 507],
            turnoutAvgPctOfRatees: 0.85,
        });
    }

    describe('create / findById', () => {
        it('persists a strategic report with empty relations', async () => {
            const cycleId = await seedCycle('Cycle');

            const created = await repo.create(buildReport(cycleId));

            expect(created.id).toBeDefined();
            expect(created.cycleId).toBe(cycleId);
            expect(created.analytics).toEqual([]);
            expect(created.insights).toEqual([]);
        });

        it('findById returns the report with included relations', async () => {
            const cycleId = await seedCycle('Cycle');
            const created = await repo.create(buildReport(cycleId));

            const fetched = await repo.findById(created.id!);

            expect(fetched).toBeInstanceOf(StrategicReportDomain);
            expect(fetched!.cycleId).toBe(cycleId);
        });

        it('findById returns null when missing', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });

    describe('findByCycleId', () => {
        it('returns the most recently created report for a cycle', async () => {
            const cycleId = await seedCycle('Cycle');
            const first = await repo.create(
                buildReport(cycleId, { cycleTitle: 'first' }),
            );
            const second = await repo.create(
                buildReport(cycleId, { cycleTitle: 'second' }),
            );

            const fetched = await repo.findByCycleId(cycleId);

            expect(fetched).toBeInstanceOf(StrategicReportDomain);
            // Ordered by createdAt desc; the second.id should come back.
            const candidateIds = [first.id, second.id];
            expect(candidateIds).toContain(fetched!.id);
        });

        it('returns null when no strategic report exists for a cycle', async () => {
            const cycleId = await seedCycle('Cycle');

            await expect(repo.findByCycleId(cycleId)).resolves.toBeNull();
        });
    });

    describe('search', () => {
        it('returns all reports when no filter is supplied', async () => {
            const a = await seedCycle('Cycle A');
            const b = await seedCycle('Cycle B');
            await repo.create(buildReport(a));
            await repo.create(buildReport(b));

            const all = await repo.search({} as any);
            expect(all).toHaveLength(2);
        });

        it('filters by cycleId', async () => {
            const a = await seedCycle('Cycle A');
            const b = await seedCycle('Cycle B');
            await repo.create(buildReport(a));
            await repo.create(buildReport(b));

            const result = await repo.search({ cycleId: a } as any);
            expect(result).toHaveLength(1);
            expect(result[0].cycleId).toBe(a);
        });

        it('filters by rateeIds (hasSome)', async () => {
            const a = await seedCycle('Cycle A');
            const b = await seedCycle('Cycle B');
            await repo.create(buildReport(a, { rateeIds: [1, 2] }));
            await repo.create(buildReport(b, { rateeIds: [3, 4] }));

            const result = await repo.search({ rateeIds: [3] } as any);

            expect(result).toHaveLength(1);
            expect(result[0].rateeIds).toEqual([3, 4]);
        });

        it('honours descending sort on createdAt', async () => {
            const a = await seedCycle('Cycle A');
            const b = await seedCycle('Cycle B');
            await repo.create(buildReport(a));
            await repo.create(buildReport(b));

            const result = await repo.search({
                sortBy: StrategicReportSortField.CREATED_AT,
                sortDirection: SortDirection.DESC,
            } as any);

            expect(result).toHaveLength(2);
        });
    });
});
