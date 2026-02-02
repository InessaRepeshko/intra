import { ReviewStage } from '@intra/shared-kernel';

/**
 * State machine transition map for Review lifecycle
 * Defines which stage transitions are allowed
 */
export const REVIEW_STAGE_TRANSITIONS: Record<ReviewStage, ReviewStage[]> = {
    // Initial stage - can be cancelled or move to user verification
    [ReviewStage.VERIFICATION_BY_HR]: [
        ReviewStage.VERIFICATION_BY_USER,
        ReviewStage.REJECTED,
        ReviewStage.CANCELED,
    ],

    // User verifies respondents - can accept, reject, or cancel
    [ReviewStage.VERIFICATION_BY_USER]: [
        ReviewStage.SELF_ASSESSMENT,
        ReviewStage.WAITING_TO_START,
        ReviewStage.REJECTED,
        ReviewStage.CANCELED,
    ],

    // Rejected - needs to go back for fixes
    [ReviewStage.REJECTED]: [
        ReviewStage.VERIFICATION_BY_HR,
        ReviewStage.VERIFICATION_BY_USER,
        ReviewStage.CANCELED,
    ],

    // Self assessment phase - can proceed or be cancelled
    [ReviewStage.SELF_ASSESSMENT]: [
        ReviewStage.WAITING_TO_START,
        ReviewStage.IN_PROGRESS,
        ReviewStage.CANCELED,
    ],

    // Waiting for official start - can begin or be cancelled
    [ReviewStage.WAITING_TO_START]: [
        ReviewStage.IN_PROGRESS,
        ReviewStage.CANCELED,
    ],

    // Active feedback collection - can complete or be cancelled
    [ReviewStage.IN_PROGRESS]: [
        ReviewStage.PREPARING_REPORT,
        ReviewStage.CANCELED,
    ],

    // Report generation in progress - moves to HR processing
    [ReviewStage.PREPARING_REPORT]: [
        ReviewStage.PROCESSING_BY_HR,
        ReviewStage.ANALYSIS,
    ],

    // HR reviews and moderates the report
    [ReviewStage.PROCESSING_BY_HR]: [
        ReviewStage.PUBLISHED,
        ReviewStage.ANALYSIS,
    ],

    // Additional analysis if needed
    [ReviewStage.ANALYSIS]: [
        ReviewStage.PROCESSING_BY_HR,
        ReviewStage.PUBLISHED,
    ],

    // Report is published - can finalize
    [ReviewStage.PUBLISHED]: [ReviewStage.FINISHED],

    // Terminal states - no further transitions
    [ReviewStage.FINISHED]: [],
    [ReviewStage.CANCELED]: [],
};

/**
 * System actor ID for automated transitions
 */
export const SYSTEM_ACTOR_ID = 0;

/**
 * Transition reasons for automated stage changes
 */
export const TRANSITION_REASONS = {
    ALL_RESPONSES_COLLECTED: 'All responses collected from respondents',
    DEADLINE_REACHED: 'Review deadline has been reached',
    HR_FORCE_COMPLETION: 'Manually completed by HR',
    SYSTEM_AUTOMATED: 'Automated system transition',
} as const;
