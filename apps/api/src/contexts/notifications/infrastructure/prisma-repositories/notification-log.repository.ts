import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    NOTIFICATION_LOG_REPOSITORY,
    NotificationLogRepositoryPort,
} from '../../application/ports/notification-log.repository.port';
import { NotificationKind } from '../../domain/notification-kind.enum';
import { NotificationLogDomain } from '../../domain/notification-log.domain';
import { NotificationLogMapper } from '../mappers/notification-log.mapper';

@Injectable()
export class NotificationLogRepository implements NotificationLogRepositoryPort {
    readonly [NOTIFICATION_LOG_REPOSITORY] = NOTIFICATION_LOG_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async findOneForReview(
        reviewId: number,
        kind: NotificationKind,
        recipientUserId: number,
    ): Promise<NotificationLogDomain | null> {
        const record = await this.prisma.notificationLog.findUnique({
            where: {
                uniq_review_kind_recipient: {
                    reviewId,
                    kind: NotificationLogMapper.toPrismaKind(kind),
                    recipientUserId,
                },
            },
        });

        return record ? NotificationLogMapper.toDomain(record) : null;
    }

    async findOneForCycle(
        cycleId: number,
        kind: NotificationKind,
        recipientUserId: number,
    ): Promise<NotificationLogDomain | null> {
        const record = await this.prisma.notificationLog.findUnique({
            where: {
                uniq_cycle_kind_recipient: {
                    cycleId,
                    kind: NotificationLogMapper.toPrismaKind(kind),
                    recipientUserId,
                },
            },
        });

        return record ? NotificationLogMapper.toDomain(record) : null;
    }

    async findOneForUser(
        kind: NotificationKind,
        recipientUserId: number,
    ): Promise<NotificationLogDomain | null> {
        // No unique constraint exists for (recipientUserId, kind) when both
        // reviewId and cycleId are null, so use findFirst. Welcome-style
        // notifications are dispatched only once per user, so a duplicate
        // here is benign (worst case: a second email if a race occurs).
        const record = await this.prisma.notificationLog.findFirst({
            where: {
                kind: NotificationLogMapper.toPrismaKind(kind),
                recipientUserId,
                reviewId: null,
                cycleId: null,
            },
        });

        return record ? NotificationLogMapper.toDomain(record) : null;
    }

    async create(log: NotificationLogDomain): Promise<NotificationLogDomain> {
        const created = await this.prisma.notificationLog.create({
            data: NotificationLogMapper.toPrisma(log),
        });
        return NotificationLogMapper.toDomain(created);
    }

    async markSent(id: number): Promise<void> {
        await this.prisma.notificationLog.update({
            where: { id },
            data: { sentAt: new Date(), errorMessage: null },
        });
    }

    async markFailure(id: number, errorMessage: string): Promise<void> {
        await this.prisma.notificationLog.update({
            where: { id },
            data: { errorMessage },
        });
    }
}
