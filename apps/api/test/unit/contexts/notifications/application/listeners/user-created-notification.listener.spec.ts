import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserCreatedEvent } from 'src/contexts/identity/application/events/user-created.event';
import { UserCreatedNotificationListener } from 'src/contexts/notifications/application/listeners/user-created-notification.listener';
import { ReviewEmailNotificationService } from 'src/contexts/notifications/application/services/review-email-notification.service';

beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('UserCreatedNotificationListener', () => {
    let listener: UserCreatedNotificationListener;
    let notifications: any;

    beforeEach(async () => {
        notifications = { notifyUserWelcome: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                UserCreatedNotificationListener,
                {
                    provide: ReviewEmailNotificationService,
                    useValue: notifications,
                },
            ],
        }).compile();

        listener = module.get(UserCreatedNotificationListener);
    });

    it('forwards user.created events to the welcome notification', async () => {
        notifications.notifyUserWelcome.mockResolvedValue(1);

        await listener.handle(new UserCreatedEvent(42, 'jane@example.com'));

        expect(notifications.notifyUserWelcome).toHaveBeenCalledWith(42);
    });

    it('swallows errors thrown by the notification service', async () => {
        notifications.notifyUserWelcome.mockRejectedValue(new Error('boom'));

        await expect(
            listener.handle(new UserCreatedEvent(42, 'jane@example.com')),
        ).resolves.toBeUndefined();
    });
});
