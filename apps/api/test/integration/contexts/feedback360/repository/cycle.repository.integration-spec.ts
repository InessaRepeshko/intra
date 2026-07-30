import '../../../setup-env';

import {
    CycleSortField,
    CycleStage,
    SortDirection,
} from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('CycleRepository (integration)', () => {
    let module: TestingModule;
    let repo: CycleRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let hrId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        repo = module.get(CycleRepository);
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
        hrId = hr.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function buildCycle(
        overrides: Partial<{
            title: string;
            stage: CycleStage;
            isActive: boolean;
            startDate: Date;
            endDate: Date;
        }> = {},
    ): CycleDomain {
        return CycleDomain.create({
            title: overrides.title ?? 'Q1 2026',
            description: 'A quarterly cycle',
            hrId,
            stage: overrides.stage ?? CycleStage.NEW,
            isActive: overrides.isActive ?? true,
            startDate: overrides.startDate ?? new Date('2026-01-01'),
            endDate: overrides.endDate ?? new Date('2026-03-31'),
        });
    }

    describe('create / findById', () => {
        it('persists a new cycle with defaults applied', async () => {
            const created = await repo.create(buildCycle());

            expect(created.id).toBeDefined();
            expect(created.title).toBe('Q1 2026');
            expect(created.stage).toBe(CycleStage.NEW);

            const fromDb = await prisma.cycle.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.title).toBe('Q1 2026');
            expect(fromDb!.hrId).toBe(hrId);
        });

        it('findById returns the cycle when found', async () => {
            const created = await repo.create(buildCycle());

            await expect(repo.findById(created.id!)).resolves.toBeInstanceOf(
                CycleDomain,
            );
        });

        it('findById returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });

    describe('search', () => {
        beforeEach(async () => {
            await repo.create(buildCycle({ title: 'Alpha cycle' }));
            await repo.create(
                buildCycle({ title: 'Beta cycle', stage: CycleStage.ACTIVE }),
            );
            await repo.create(
                buildCycle({ title: 'Gamma cycle', isActive: false }),
            );
        });

        it('returns all cycles when no filter is supplied', async () => {
            const all = await repo.search({} as any);
            expect(all).toHaveLength(3);
        });

        it('filters by title (case insensitive substring)', async () => {
            const result = await repo.search({ title: 'beta' } as any);
            expect(result.map((c) => c.title)).toEqual(['Beta cycle']);
        });

        it('filters by stage', async () => {
            const result = await repo.search({
                stage: CycleStage.ACTIVE,
            } as any);
            expect(result.map((c) => c.title)).toEqual(['Beta cycle']);
        });

        it('filters by isActive', async () => {
            const result = await repo.search({ isActive: false } as any);
            expect(result.map((c) => c.title)).toEqual(['Gamma cycle']);
        });

        it('honours descending sort on title', async () => {
            const result = await repo.search({
                sortBy: CycleSortField.TITLE,
                sortDirection: SortDirection.DESC,
            } as any);
            const titles = result.map((c) => c.title);
            expect(titles).toEqual([...titles].sort().reverse());
        });
    });

    describe('updateById', () => {
        it('persists the patched scalar fields', async () => {
            const created = await repo.create(buildCycle());

            const updated = await repo.updateById(created.id!, {
                title: 'Renamed',
                description: 'updated',
            } as any);

            expect(updated.title).toBe('Renamed');
            expect(updated.description).toBe('updated');
        });

        it('updates the cycle stage when patched', async () => {
            const created = await repo.create(buildCycle());

            const updated = await repo.updateById(created.id!, {
                stage: CycleStage.ACTIVE,
            } as any);

            expect(updated.stage).toBe(CycleStage.ACTIVE);
        });
    });

    describe('deleteById', () => {
        it('removes the cycle row', async () => {
            const created = await repo.create(buildCycle());

            await repo.deleteById(created.id!);

            const fromDb = await prisma.cycle.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });
    });
});
