import { CycleStage } from '@intra/shared-kernel';

/**
 * State machine transition map for Cycle
 * Defines which stage transitions are allowed
 */
export const CYCLE_STAGE_TRANSITIONS: Record<CycleStage, CycleStage[]> = {
    [CycleStage.NEW]: [CycleStage.ACTIVE, CycleStage.CANCELED],

    [CycleStage.ACTIVE]: [CycleStage.FINISHED, CycleStage.CANCELED],

    [CycleStage.FINISHED]: [CycleStage.PREPARING_REPORT, CycleStage.ARCHIVED],

    [CycleStage.PREPARING_REPORT]: [CycleStage.PUBLISHED, CycleStage.ARCHIVED],

    [CycleStage.PUBLISHED]: [CycleStage.ARCHIVED],

    [CycleStage.CANCELED]: [CycleStage.ARCHIVED],

    [CycleStage.ARCHIVED]: [],
};

/**
 * Transition reasons for automated stage changes
 */
export const TRANSITION_REASONS = {
    CYCLE_UPDATED: 'Cycle updated',
    ALL_REVIEWS_COLLECTED: 'All reviews collected',
    DEADLINE_REACHED: 'Cycle deadline has been reached',
    FORCE_FINISH: 'Manually finished by HR or Admin',
    SYSTEM_AUTOMATED: 'Automated system transition',
} as const;
