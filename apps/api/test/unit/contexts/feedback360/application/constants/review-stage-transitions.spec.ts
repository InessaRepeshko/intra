import { ReviewStage } from '@intra/shared-kernel';
import {
    REVIEW_STAGE_TRANSITIONS,
    TRANSITION_REASONS,
} from 'src/contexts/feedback360/application/constants/review-stage-transitions';

describe('REVIEW_STAGE_TRANSITIONS', () => {
    it('allows NEW to move to SELF_ASSESSMENT or CANCELED only', () => {
        expect(REVIEW_STAGE_TRANSITIONS[ReviewStage.NEW]).toEqual([
            ReviewStage.SELF_ASSESSMENT,
            ReviewStage.CANCELED,
        ]);
    });

    it('allows SELF_ASSESSMENT to move to WAITING_TO_START, IN_PROGRESS, or CANCELED', () => {
        expect(REVIEW_STAGE_TRANSITIONS[ReviewStage.SELF_ASSESSMENT]).toEqual([
            ReviewStage.WAITING_TO_START,
            ReviewStage.IN_PROGRESS,
            ReviewStage.CANCELED,
        ]);
    });

    it('allows WAITING_TO_START to move to IN_PROGRESS, FINISHED, or CANCELED', () => {
        expect(REVIEW_STAGE_TRANSITIONS[ReviewStage.WAITING_TO_START]).toEqual([
            ReviewStage.IN_PROGRESS,
            ReviewStage.FINISHED,
            ReviewStage.CANCELED,
        ]);
    });

    it('allows IN_PROGRESS to move to FINISHED or CANCELED', () => {
        expect(REVIEW_STAGE_TRANSITIONS[ReviewStage.IN_PROGRESS]).toEqual([
            ReviewStage.FINISHED,
            ReviewStage.CANCELED,
        ]);
    });

    it('allows FINISHED to move to PREPARING_REPORT only', () => {
        expect(REVIEW_STAGE_TRANSITIONS[ReviewStage.FINISHED]).toEqual([
            ReviewStage.PREPARING_REPORT,
        ]);
    });

    it('allows PREPARING_REPORT to move into the report pipeline', () => {
        expect(REVIEW_STAGE_TRANSITIONS[ReviewStage.PREPARING_REPORT]).toEqual([
            ReviewStage.PROCESSING_BY_HR,
            ReviewStage.PUBLISHED,
            ReviewStage.ANALYSIS,
            ReviewStage.ARCHIVED,
        ]);
    });

    it('allows PROCESSING_BY_HR to move to PUBLISHED, ANALYSIS, or ARCHIVED', () => {
        expect(REVIEW_STAGE_TRANSITIONS[ReviewStage.PROCESSING_BY_HR]).toEqual([
            ReviewStage.PUBLISHED,
            ReviewStage.ANALYSIS,
            ReviewStage.ARCHIVED,
        ]);
    });

    it('allows PUBLISHED to move to ANALYSIS or ARCHIVED', () => {
        expect(REVIEW_STAGE_TRANSITIONS[ReviewStage.PUBLISHED]).toEqual([
            ReviewStage.ANALYSIS,
            ReviewStage.ARCHIVED,
        ]);
    });

    it('allows ANALYSIS to move to ARCHIVED only', () => {
        expect(REVIEW_STAGE_TRANSITIONS[ReviewStage.ANALYSIS]).toEqual([
            ReviewStage.ARCHIVED,
        ]);
    });

    it('allows CANCELED to move to ARCHIVED only', () => {
        expect(REVIEW_STAGE_TRANSITIONS[ReviewStage.CANCELED]).toEqual([
            ReviewStage.ARCHIVED,
        ]);
    });

    it('treats ARCHIVED as a terminal stage', () => {
        expect(REVIEW_STAGE_TRANSITIONS[ReviewStage.ARCHIVED]).toEqual([]);
    });

    it('covers every ReviewStage as an entry key', () => {
        const stages = Object.values(ReviewStage);
        for (const stage of stages) {
            expect(REVIEW_STAGE_TRANSITIONS[stage]).toBeDefined();
        }
    });
});

describe('TRANSITION_REASONS (review)', () => {
    it('exposes the canonical reason strings', () => {
        expect(TRANSITION_REASONS.REVIEW_UPDATED).toBe('Review updated');
        expect(TRANSITION_REASONS.ALL_RESPONSES_COLLECTED).toBe(
            'All responses collected from respondents',
        );
        expect(TRANSITION_REASONS.DEADLINE_REACHED).toBe(
            'Review deadline has been reached',
        );
        expect(TRANSITION_REASONS.FORCE_FINISH).toBe(
            'Manually finished by HR or Admin',
        );
        expect(TRANSITION_REASONS.SYSTEM_AUTOMATED).toBe(
            'Automated system transition',
        );
    });
});
