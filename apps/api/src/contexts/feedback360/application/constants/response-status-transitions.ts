import { ResponseStatus } from '@intra/shared-kernel';

/**
 * State machine transition map for respondent response status
 * Defines which stage transitions are allowed
 */
export const RESPONSE_STATUS_TRANSITIONS: Record<
    ResponseStatus,
    ResponseStatus[]
> = {
    [ResponseStatus.PENDING]: [
        ResponseStatus.IN_PROGRESS,
        ResponseStatus.CANCELED,
    ],

    [ResponseStatus.IN_PROGRESS]: [
        ResponseStatus.COMPLETED,
        ResponseStatus.CANCELED,
    ],

    [ResponseStatus.COMPLETED]: [],

    [ResponseStatus.CANCELED]: [],
};

/**
 * Transition reasons for automated stage changes
 */
export const TRANSITION_REASONS = {
    RESPONSE_ASSIGNED: 'HR or Admin assigned review to respondent',
    RESPONSE_ADDED: 'Respondent added response',
    RESPONSE_CANCELED: 'HR or Admin or Respondent canceled review assignment',
    SYSTEM_AUTOMATED: 'Automated system transition',
} as const;
