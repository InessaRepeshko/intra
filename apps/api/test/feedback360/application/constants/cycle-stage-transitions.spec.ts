import { CycleStage } from '@intra/shared-kernel';
import {
    CYCLE_STAGE_TRANSITIONS,
    TRANSITION_REASONS,
} from 'src/contexts/feedback360/application/constants/cycle-stage-transitions';

describe('CYCLE_STAGE_TRANSITIONS', () => {
    it('allows NEW to move to ACTIVE or CANCELED only', () => {
        expect(CYCLE_STAGE_TRANSITIONS[CycleStage.NEW]).toEqual([
            CycleStage.ACTIVE,
            CycleStage.CANCELED,
        ]);
    });

    it('allows ACTIVE to move to FINISHED or CANCELED only', () => {
        expect(CYCLE_STAGE_TRANSITIONS[CycleStage.ACTIVE]).toEqual([
            CycleStage.FINISHED,
            CycleStage.CANCELED,
        ]);
    });

    it('allows FINISHED to move to PREPARING_REPORT or ARCHIVED only', () => {
        expect(CYCLE_STAGE_TRANSITIONS[CycleStage.FINISHED]).toEqual([
            CycleStage.PREPARING_REPORT,
            CycleStage.ARCHIVED,
        ]);
    });

    it('allows PREPARING_REPORT to move to PUBLISHED or ARCHIVED only', () => {
        expect(CYCLE_STAGE_TRANSITIONS[CycleStage.PREPARING_REPORT]).toEqual([
            CycleStage.PUBLISHED,
            CycleStage.ARCHIVED,
        ]);
    });

    it('allows PUBLISHED to move to ARCHIVED only', () => {
        expect(CYCLE_STAGE_TRANSITIONS[CycleStage.PUBLISHED]).toEqual([
            CycleStage.ARCHIVED,
        ]);
    });

    it('allows CANCELED to move to ARCHIVED only', () => {
        expect(CYCLE_STAGE_TRANSITIONS[CycleStage.CANCELED]).toEqual([
            CycleStage.ARCHIVED,
        ]);
    });

    it('treats ARCHIVED as a terminal stage', () => {
        expect(CYCLE_STAGE_TRANSITIONS[CycleStage.ARCHIVED]).toEqual([]);
    });

    it('covers every CycleStage as an entry key', () => {
        const stages = Object.values(CycleStage);
        for (const stage of stages) {
            expect(CYCLE_STAGE_TRANSITIONS[stage]).toBeDefined();
        }
    });

    it('never lists a stage as a transition from itself', () => {
        for (const [from, targets] of Object.entries(CYCLE_STAGE_TRANSITIONS)) {
            expect(targets).not.toContain(from);
        }
    });
});

describe('TRANSITION_REASONS', () => {
    it('exposes the canonical reason strings', () => {
        expect(TRANSITION_REASONS.CYCLE_UPDATED).toBe('Cycle updated');
        expect(TRANSITION_REASONS.ALL_REVIEWS_COLLECTED).toBe(
            'All reviews collected',
        );
        expect(TRANSITION_REASONS.DEADLINE_REACHED).toBe(
            'Cycle deadline has been reached',
        );
        expect(TRANSITION_REASONS.FORCE_FINISH).toBe(
            'Manually finished by HR or Admin',
        );
        expect(TRANSITION_REASONS.SYSTEM_AUTOMATED).toBe(
            'Automated system transition',
        );
    });
});
