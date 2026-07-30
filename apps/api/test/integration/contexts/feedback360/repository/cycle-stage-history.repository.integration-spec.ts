import '../../../setup-env';

import { CycleStage } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleStageHistoryDomain } from 'src/contexts/feedback360/domain/cycle-stage-history.domain';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { CycleStageHistoryRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle-stage-history.repository';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('CycleStageHistoryRepository (integration)', () => {
    let module: TestingModule;
    let repo: CycleStageHistoryRepository;
    let cycles: CycleRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let cycleId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        repo = module.get(CycleStageHistoryRepository);
        cycles = module.get(CycleRepository);
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
        const cycle = await cycles.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hr.id!,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );
        cycleId = cycle.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create', () => {
        it('persists a new history row', async () => {
            const created = await repo.create(
                CycleStageHistoryDomain.create({
                    cycleId,
                    fromStage: CycleStage.NEW,
                    toStage: CycleStage.ACTIVE,
                    changedById: null,
                    changedByName: 'system',
                    reason: 'manual trigger',
                }),
            );

            expect(created.id).toBeDefined();
            expect(created.fromStage).toBe(CycleStage.NEW);
            expect(created.toStage).toBe(CycleStage.ACTIVE);
        });
    });

    describe('findByCycleId', () => {
        it('returns rows in ascending createdAt order', async () => {
            await repo.create(
                CycleStageHistoryDomain.create({
                    cycleId,
                    fromStage: CycleStage.NEW,
                    toStage: CycleStage.ACTIVE,
                }),
            );
            await repo.create(
                CycleStageHistoryDomain.create({
                    cycleId,
                    fromStage: CycleStage.ACTIVE,
                    toStage: CycleStage.FINISHED,
                }),
            );

            const rows = await repo.findByCycleId(cycleId);

            expect(rows.map((r) => r.toStage)).toEqual([
                CycleStage.ACTIVE,
                CycleStage.FINISHED,
            ]);
        });

        it('returns an empty array when no history exists', async () => {
            await expect(repo.findByCycleId(cycleId)).resolves.toEqual([]);
        });
    });

    describe('findById', () => {
        it('returns the row when found', async () => {
            const created = await repo.create(
                CycleStageHistoryDomain.create({
                    cycleId,
                    fromStage: CycleStage.NEW,
                    toStage: CycleStage.ACTIVE,
                }),
            );

            await expect(repo.findById(created.id!)).resolves.toBeInstanceOf(
                CycleStageHistoryDomain,
            );
        });

        it('returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });
});
