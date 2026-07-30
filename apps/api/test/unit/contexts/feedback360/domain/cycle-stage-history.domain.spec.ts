import { CycleStage } from '@intra/shared-kernel';
import { CycleStageHistoryDomain } from 'src/contexts/feedback360/domain/cycle-stage-history.domain';

describe('CycleStageHistoryDomain', () => {
    const baseProps = {
        cycleId: 1,
        fromStage: CycleStage.NEW,
        toStage: CycleStage.ACTIVE,
    };

    describe('create', () => {
        it('creates a history record with all supplied properties', () => {
            const history = CycleStageHistoryDomain.create({
                id: 99,
                ...baseProps,
                changedById: 7,
                changedByName: 'HR Manager',
                reason: 'Cycle updated',
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(history.id).toBe(99);
            expect(history.cycleId).toBe(1);
            expect(history.fromStage).toBe(CycleStage.NEW);
            expect(history.toStage).toBe(CycleStage.ACTIVE);
            expect(history.changedById).toBe(7);
            expect(history.changedByName).toBe('HR Manager');
            expect(history.reason).toBe('Cycle updated');
            expect(history.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('normalises missing actor/reason fields to null', () => {
            const history = CycleStageHistoryDomain.create(baseProps);
            expect(history.changedById).toBeNull();
            expect(history.changedByName).toBeNull();
            expect(history.reason).toBeNull();
        });
    });
});
