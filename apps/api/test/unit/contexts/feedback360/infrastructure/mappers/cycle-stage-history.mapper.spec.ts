import { CycleStageHistory as PrismaCycleStageHistory } from '@intra/database';
import { CycleStage } from '@intra/shared-kernel';
import { CycleStageHistoryDomain } from 'src/contexts/feedback360/domain/cycle-stage-history.domain';
import { CycleStageHistoryMapper } from 'src/contexts/feedback360/infrastructure/mappers/cycle-stage-history.mapper';

describe('CycleStageHistoryMapper', () => {
    const prismaHistory = {
        id: 11,
        cycleId: 100,
        fromStage: 'NEW' as PrismaCycleStageHistory['fromStage'],
        toStage: 'ACTIVE' as PrismaCycleStageHistory['toStage'],
        changedById: 7,
        changedByName: 'HR Manager',
        reason: 'Cycle updated',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as PrismaCycleStageHistory;

    describe('toDomain', () => {
        it('converts a prisma row into a CycleStageHistoryDomain', () => {
            const domain = CycleStageHistoryMapper.toDomain(prismaHistory);

            expect(domain).toBeInstanceOf(CycleStageHistoryDomain);
            expect(domain.id).toBe(11);
            expect(domain.cycleId).toBe(100);
            expect(domain.fromStage).toBe(CycleStage.NEW);
            expect(domain.toStage).toBe(CycleStage.ACTIVE);
            expect(domain.changedById).toBe(7);
            expect(domain.changedByName).toBe('HR Manager');
            expect(domain.reason).toBe('Cycle updated');
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain into a Prisma create input', () => {
            const domain = CycleStageHistoryDomain.create({
                cycleId: 100,
                fromStage: CycleStage.ACTIVE,
                toStage: CycleStage.FINISHED,
                changedById: 0,
                changedByName: 'System',
            });

            const prisma = CycleStageHistoryMapper.toPrisma(domain);

            expect(prisma.cycleId).toBe(100);
            expect(prisma.fromStage).toBe('ACTIVE');
            expect(prisma.toStage).toBe('FINISHED');
            expect(prisma.changedById).toBe(0);
            expect(prisma.changedByName).toBe('System');
            expect(prisma.reason).toBeNull();
        });
    });
});
