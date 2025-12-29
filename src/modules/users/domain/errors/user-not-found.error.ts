export class UserNotFoundError extends Error {
  constructor(public readonly userIdOrEmail: number | string) {
    super(`User not found: ${userIdOrEmail}`);
    this.name = 'UserNotFoundError';
  }
}


