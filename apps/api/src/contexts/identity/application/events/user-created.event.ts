/**
 * Domain event emitted when a new user is created via the identity
 * service (HR-driven flow). Listeners (e.g. notifications) can react
 * by sending a welcome email.
 */
export class UserCreatedEvent {
    constructor(
        public readonly userId: number,
        public readonly email: string,
    ) {}
}
