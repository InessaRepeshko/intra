import { ResponseStatus } from '@intra/shared-kernel';
import {
    RESPONSE_STATUS_TRANSITIONS,
    TRANSITION_REASONS,
} from 'src/contexts/feedback360/application/constants/response-status-transitions';

describe('RESPONSE_STATUS_TRANSITIONS', () => {
    it('allows PENDING to move to IN_PROGRESS or CANCELED', () => {
        expect(RESPONSE_STATUS_TRANSITIONS[ResponseStatus.PENDING]).toEqual([
            ResponseStatus.IN_PROGRESS,
            ResponseStatus.CANCELED,
        ]);
    });

    it('allows IN_PROGRESS to move to COMPLETED or CANCELED', () => {
        expect(RESPONSE_STATUS_TRANSITIONS[ResponseStatus.IN_PROGRESS]).toEqual(
            [ResponseStatus.COMPLETED, ResponseStatus.CANCELED],
        );
    });

    it('treats COMPLETED and CANCELED as terminal', () => {
        expect(RESPONSE_STATUS_TRANSITIONS[ResponseStatus.COMPLETED]).toEqual(
            [],
        );
        expect(RESPONSE_STATUS_TRANSITIONS[ResponseStatus.CANCELED]).toEqual(
            [],
        );
    });

    it('covers every ResponseStatus as an entry key', () => {
        const statuses = Object.values(ResponseStatus);
        for (const status of statuses) {
            expect(RESPONSE_STATUS_TRANSITIONS[status]).toBeDefined();
        }
    });
});

describe('TRANSITION_REASONS (response)', () => {
    it('exposes the canonical reason strings', () => {
        expect(TRANSITION_REASONS.RESPONSE_ASSIGNED).toBe(
            'HR or Admin assigned review to respondent',
        );
        expect(TRANSITION_REASONS.RESPONSE_ADDED).toBe(
            'Respondent added response',
        );
        expect(TRANSITION_REASONS.RESPONSE_CANCELED).toBe(
            'HR or Admin or Respondent canceled review assignment',
        );
        expect(TRANSITION_REASONS.SYSTEM_AUTOMATED).toBe(
            'Automated system transition',
        );
    });
});
