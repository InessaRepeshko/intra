import { NotificationChannel } from './notification-channel.enum';
import { NotificationKind } from './notification-kind.enum';

export type NotificationLogProps = {
    id?: number;
    reviewId?: number | null;
    cycleId?: number | null;
    kind: NotificationKind;
    channel?: NotificationChannel;
    recipientUserId: number;
    recipientEmail: string;
    sentAt?: Date | null;
    errorMessage?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export class NotificationLogDomain {
    readonly id?: number;
    readonly reviewId: number | null;
    readonly cycleId: number | null;
    readonly kind: NotificationKind;
    readonly channel: NotificationChannel;
    readonly recipientUserId: number;
    readonly recipientEmail: string;
    readonly sentAt: Date | null;
    readonly errorMessage: string | null;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    private constructor(props: NotificationLogProps) {
        this.id = props.id;
        this.reviewId = props.reviewId ?? null;
        this.cycleId = props.cycleId ?? null;
        this.kind = props.kind;
        this.channel = props.channel ?? NotificationChannel.EMAIL;
        this.recipientUserId = props.recipientUserId;
        this.recipientEmail = props.recipientEmail;
        this.sentAt = props.sentAt ?? null;
        this.errorMessage = props.errorMessage ?? null;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static create(props: NotificationLogProps): NotificationLogDomain {
        return new NotificationLogDomain(props);
    }

    isSent(): boolean {
        return this.sentAt !== null;
    }
}
