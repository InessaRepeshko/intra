export class TeamNotFoundError extends Error {
  constructor(public readonly teamId: number) {
    super(`Team not found: ${teamId}`);
    this.name = 'TeamNotFoundError';
  }
}


