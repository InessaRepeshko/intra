import { NotificationChannel } from 'src/contexts/notifications/domain/notification-channel.enum';
import { NotificationKind } from 'src/contexts/notifications/domain/notification-kind.enum';
import { NotificationLogDomain } from 'src/contexts/notifications/domain/notification-log.domain';

describe('NotificationLogDomain', () => {
    const baseProps = {
        kind: NotificationKind.RATEE_SELF_ASSESSMENT,
        recipientUserId: 200,
        recipientEmail: 'jane@example.com',
    };

    describe('create', () => {
        it('creates a log with every supplied property', () => {
            const log = NotificationLogDomain.create({
                id: 1,
                reviewId: 10,
                cycleId: 100,
                kind: NotificationKind.HR_REPORT_READY,
                channel: NotificationChannel.EMAIL,
                recipientUserId: 200,
                recipientEmail: 'jane@example.com',
                sentAt: new Date('2025-01-02T00:00:00.000Z'),
                errorMessage: 'boom',
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            expect(log.id).toBe(1);
            expect(log.reviewId).toBe(10);
            expect(log.cycleId).toBe(100);
            expect(log.kind).toBe(NotificationKind.HR_REPORT_READY);
            expect(log.channel).toBe(NotificationChannel.EMAIL);
            expect(log.recipientUserId).toBe(200);
            expect(log.recipientEmail).toBe('jane@example.com');
            expect(log.sentAt).toEqual(new Date('2025-01-02T00:00:00.000Z'));
            expect(log.errorMessage).toBe('boom');
        });

        it('defaults channel to EMAIL when not provided', () => {
            const log = NotificationLogDomain.create(baseProps);
            expect(log.channel).toBe(NotificationChannel.EMAIL);
        });

        it('normalises missing fields to null', () => {
            const log = NotificationLogDomain.create(baseProps);
            expect(log.reviewId).toBeNull();
            expect(log.cycleId).toBeNull();
            expect(log.sentAt).toBeNull();
            expect(log.errorMessage).toBeNull();
        });
    });

    describe('isSent', () => {
        it('returns false when sentAt is null', () => {
            const log = NotificationLogDomain.create(baseProps);
            expect(log.isSent()).toBe(false);
        });

        it('returns true when sentAt is a Date', () => {
            const log = NotificationLogDomain.create({
                ...baseProps,
                sentAt: new Date('2025-01-02T00:00:00.000Z'),
            });
            expect(log.isSent()).toBe(true);
        });
    });
});
