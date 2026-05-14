import { UserCreatedEvent } from 'src/contexts/identity/application/events/user-created.event';

describe('UserCreatedEvent', () => {
    it('exposes userId and email as readonly fields', () => {
        const event = new UserCreatedEvent(42, 'jane@example.com');

        expect(event.userId).toBe(42);
        expect(event.email).toBe('jane@example.com');
    });
});
