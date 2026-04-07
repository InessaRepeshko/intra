import { ReviewStage } from '@intra/shared-kernel';

/**
 * State machine transition map for Review lifecycle
 * Defines which stage transitions are allowed
 */
export const REVIEW_STAGE_TRANSITIONS: Record<ReviewStage, ReviewStage[]> = {
    [ReviewStage.NEW]: [ReviewStage.SELF_ASSESSMENT, ReviewStage.CANCELED],

    [ReviewStage.SELF_ASSESSMENT]: [
        ReviewStage.WAITING_TO_START,
        ReviewStage.IN_PROGRESS,
        ReviewStage.CANCELED,
    ],

    [ReviewStage.WAITING_TO_START]: [
        ReviewStage.IN_PROGRESS,
        ReviewStage.FINISHED,
        ReviewStage.CANCELED,
    ],

    [ReviewStage.IN_PROGRESS]: [ReviewStage.FINISHED, ReviewStage.CANCELED],

    [ReviewStage.FINISHED]: [ReviewStage.PREPARING_REPORT],

    [ReviewStage.PREPARING_REPORT]: [
        ReviewStage.PROCESSING_BY_HR,
        ReviewStage.PUBLISHED,
        ReviewStage.ANALYSIS,
        ReviewStage.ARCHIVED,
    ],

    [ReviewStage.PROCESSING_BY_HR]: [
        ReviewStage.PUBLISHED,
        ReviewStage.ANALYSIS,
        ReviewStage.ARCHIVED,
    ],

    [ReviewStage.PUBLISHED]: [ReviewStage.ANALYSIS, ReviewStage.ARCHIVED],

    [ReviewStage.ANALYSIS]: [ReviewStage.ARCHIVED],

    [ReviewStage.CANCELED]: [ReviewStage.ARCHIVED],

    [ReviewStage.ARCHIVED]: [],
};

/**
 * Transition reasons for automated stage changes
 */
export const TRANSITION_REASONS = {
    REVIEW_UPDATED: 'Review updated',
    ALL_RESPONSES_COLLECTED: 'All responses collected from respondents',
    DEADLINE_REACHED: 'Review deadline has been reached',
    FORCE_FINISH: 'Manually finished by HR or Admin',
    SYSTEM_AUTOMATED: 'Automated system transition',
} as const;
