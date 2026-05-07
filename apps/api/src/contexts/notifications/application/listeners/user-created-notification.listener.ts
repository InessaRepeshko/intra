import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from 'src/contexts/identity/application/events/user-created.event';
import { ReviewEmailNotificationService } from '../services/review-email-notification.service';

@Injectable()
export class UserCreatedNotificationListener {
    private readonly logger = new Logger(UserCreatedNotificationListener.name);

    constructor(
        private readonly notifications: ReviewEmailNotificationService,
    ) {}

    @OnEvent('user.created', { async: true })
    async handle(event: UserCreatedEvent): Promise<void> {
        const { userId } = event;

        try {
            const sent = await this.notifications.notifyUserWelcome(userId);
            this.logger.log(
                `dispatched ${sent} welcome email(s) for user=${userId}`,
            );
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            this.logger.error(
                `Failed to handle user.created for user=${userId}: ${message}`,
                error instanceof Error ? error.stack : undefined,
            );
        }
    }
}
