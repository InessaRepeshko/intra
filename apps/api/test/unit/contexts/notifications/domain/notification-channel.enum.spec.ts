import { NotificationChannel } from 'src/contexts/notifications/domain/notification-channel.enum';

describe('NotificationChannel', () => {
    it('exposes the EMAIL channel value', () => {
        expect(NotificationChannel.EMAIL).toBe('EMAIL');
    });
});
