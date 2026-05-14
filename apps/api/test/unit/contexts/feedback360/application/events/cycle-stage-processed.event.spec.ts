import { CycleStage } from '@intra/shared-kernel';
import { CycleStageChangedEvent } from 'src/contexts/feedback360/application/events/cycle-stage-changed.event';
import { CycleStageProcessedEvent } from 'src/contexts/feedback360/application/events/cycle-stage-processed.event';

describe('CycleStageProcessedEvent', () => {
    describe('fromCycleStageChangedEvent', () => {
        it('maps the toStage to the processed-event currentStage', () => {
            const source = new CycleStageChangedEvent(
                42,
                CycleStage.NEW,
                CycleStage.ACTIVE,
                7,
                'HR Manager',
                'Cycle updated',
            );

            const event =
                CycleStageProcessedEvent.fromCycleStageChangedEvent(source);

            expect(event).toBeInstanceOf(CycleStageProcessedEvent);
            expect(event.cycleId).toBe(42);
            expect(event.currentStage).toBe(CycleStage.ACTIVE);
            expect(event.changedById).toBe(7);
            expect(event.changedByName).toBe('HR Manager');
            expect(event.reason).toBe('Cycle updated');
        });

        it('forwards optional actor/reason fields when undefined', () => {
            const source = new CycleStageChangedEvent(
                10,
                CycleStage.NEW,
                CycleStage.ACTIVE,
            );

            const event =
                CycleStageProcessedEvent.fromCycleStageChangedEvent(source);

            expect(event.cycleId).toBe(10);
            expect(event.currentStage).toBe(CycleStage.ACTIVE);
            expect(event.changedById).toBeUndefined();
            expect(event.changedByName).toBeUndefined();
            expect(event.reason).toBeUndefined();
        });
    });
});
