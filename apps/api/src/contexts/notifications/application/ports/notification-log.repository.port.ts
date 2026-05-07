import { NotificationKind } from '../../domain/notification-kind.enum';
import { NotificationLogDomain } from '../../domain/notification-log.domain';

export const NOTIFICATION_LOG_REPOSITORY = Symbol(
    'NOTIFICATIONS.NOTIFICATION_LOG_REPOSITORY',
);

export interface NotificationLogRepositoryPort {
    findOneForReview(
        reviewId: number,
        kind: NotificationKind,
        recipientUserId: number,
    ): Promise<NotificationLogDomain | null>;

    findOneForCycle(
        cycleId: number,
        kind: NotificationKind,
        recipientUserId: number,
    ): Promise<NotificationLogDomain | null>;

    /**
     * Find a standalone (no review/cycle) notification for a user by kind.
     * Used for user-scoped notifications such as USER_WELCOME, where the
     * dedup key is purely (recipientUserId, kind).
     */
    findOneForUser(
        kind: NotificationKind,
        recipientUserId: number,
    ): Promise<NotificationLogDomain | null>;

    create(log: NotificationLogDomain): Promise<NotificationLogDomain>;

    markSent(id: number): Promise<void>;

    markFailure(id: number, errorMessage: string): Promise<void>;
}
