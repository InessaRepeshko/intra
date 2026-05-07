import { NotificationKind } from '../../domain/notification-kind.enum';
import { NotificationLogDomain } from '../../domain/notification-log.domain';

export const NOTIFICATION_LOG_REPOSITORY = Symbol(
    'NOTIFICATIONS.NOTIFICATION_LOG_REPOSITORY',
);

export interface NotificationLogRepositoryPort {
    findOne(
        reviewId: number,
        kind: NotificationKind,
        recipientUserId: number,
    ): Promise<NotificationLogDomain | null>;

    create(log: NotificationLogDomain): Promise<NotificationLogDomain>;

    markSent(id: number): Promise<void>;

    markFailure(id: number, errorMessage: string): Promise<void>;
}
