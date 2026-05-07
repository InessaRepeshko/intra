import {
    Prisma,
    NotificationChannel as PrismaNotificationChannel,
    NotificationKind as PrismaNotificationKind,
    NotificationLog as PrismaNotificationLog,
} from '@intra/database';
import { NotificationChannel } from '../../domain/notification-channel.enum';
import { NotificationKind } from '../../domain/notification-kind.enum';
import { NotificationLogDomain } from '../../domain/notification-log.domain';

export class NotificationLogMapper {
    static toDomain(record: PrismaNotificationLog): NotificationLogDomain {
        return NotificationLogDomain.create({
            id: record.id,
            reviewId: record.reviewId,
            kind: NotificationLogMapper.fromPrismaKind(record.kind),
            channel: NotificationLogMapper.fromPrismaChannel(record.channel),
            recipientUserId: record.recipientUserId,
            recipientEmail: record.recipientEmail,
            sentAt: record.sentAt,
            errorMessage: record.errorMessage,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        });
    }

    static toPrisma(
        log: NotificationLogDomain,
    ): Prisma.NotificationLogUncheckedCreateInput {
        return {
            reviewId: log.reviewId,
            kind: NotificationLogMapper.toPrismaKind(log.kind),
            channel: NotificationLogMapper.toPrismaChannel(log.channel),
            recipientUserId: log.recipientUserId,
            recipientEmail: log.recipientEmail,
            sentAt: log.sentAt,
            errorMessage: log.errorMessage,
        };
    }

    static toPrismaKind(kind: NotificationKind): PrismaNotificationKind {
        return kind as unknown as PrismaNotificationKind;
    }

    static fromPrismaKind(kind: PrismaNotificationKind): NotificationKind {
        return kind as unknown as NotificationKind;
    }

    static toPrismaChannel(
        channel: NotificationChannel,
    ): PrismaNotificationChannel {
        return channel as unknown as PrismaNotificationChannel;
    }

    static fromPrismaChannel(
        channel: PrismaNotificationChannel,
    ): NotificationChannel {
        return channel as unknown as NotificationChannel;
    }
}
