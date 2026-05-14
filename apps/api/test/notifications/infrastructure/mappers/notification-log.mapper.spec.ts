import { NotificationLog as PrismaNotificationLog } from '@intra/database';
import { NotificationChannel } from 'src/contexts/notifications/domain/notification-channel.enum';
import { NotificationKind } from 'src/contexts/notifications/domain/notification-kind.enum';
import { NotificationLogDomain } from 'src/contexts/notifications/domain/notification-log.domain';
import { NotificationLogMapper } from 'src/contexts/notifications/infrastructure/mappers/notification-log.mapper';

describe('NotificationLogMapper', () => {
    const prismaRow = {
        id: 1,
        reviewId: 10,
        cycleId: 100,
        kind: 'HR_REPORT_READY' as PrismaNotificationLog['kind'],
        channel: 'EMAIL' as PrismaNotificationLog['channel'],
        recipientUserId: 200,
        recipientEmail: 'jane@example.com',
        sentAt: new Date('2025-01-02T00:00:00.000Z'),
        errorMessage: null,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    } as PrismaNotificationLog;

    describe('toDomain', () => {
        it('converts a prisma row into a NotificationLogDomain', () => {
            const domain = NotificationLogMapper.toDomain(prismaRow);

            expect(domain).toBeInstanceOf(NotificationLogDomain);
            expect(domain.id).toBe(1);
            expect(domain.reviewId).toBe(10);
            expect(domain.cycleId).toBe(100);
            expect(domain.kind).toBe(NotificationKind.HR_REPORT_READY);
            expect(domain.channel).toBe(NotificationChannel.EMAIL);
            expect(domain.recipientUserId).toBe(200);
            expect(domain.recipientEmail).toBe('jane@example.com');
            expect(domain.sentAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain object into a Prisma create input', () => {
            const domain = NotificationLogDomain.create({
                reviewId: 10,
                cycleId: null,
                kind: NotificationKind.RATEE_SELF_ASSESSMENT,
                recipientUserId: 200,
                recipientEmail: 'jane@example.com',
            });

            const prisma = NotificationLogMapper.toPrisma(domain);

            expect(prisma.reviewId).toBe(10);
            expect(prisma.cycleId).toBeNull();
            expect(prisma.kind).toBe('RATEE_SELF_ASSESSMENT');
            expect(prisma.channel).toBe('EMAIL');
            expect(prisma.recipientUserId).toBe(200);
            expect(prisma.recipientEmail).toBe('jane@example.com');
            expect(prisma.sentAt).toBeNull();
            expect(prisma.errorMessage).toBeNull();
        });
    });

    describe('enum conversions', () => {
        it('passes the notification kind through unchanged in both directions', () => {
            expect(
                NotificationLogMapper.toPrismaKind(
                    NotificationKind.USER_WELCOME,
                ),
            ).toBe('USER_WELCOME');
            expect(
                NotificationLogMapper.fromPrismaKind(
                    'CYCLE_STRATEGIC_REPORT_READY' as PrismaNotificationLog['kind'],
                ),
            ).toBe(NotificationKind.CYCLE_STRATEGIC_REPORT_READY);
        });

        it('passes the notification channel through unchanged in both directions', () => {
            expect(
                NotificationLogMapper.toPrismaChannel(NotificationChannel.EMAIL),
            ).toBe('EMAIL');
            expect(
                NotificationLogMapper.fromPrismaChannel(
                    'EMAIL' as PrismaNotificationLog['channel'],
                ),
            ).toBe(NotificationChannel.EMAIL);
        });
    });
});
