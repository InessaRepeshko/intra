export class Feedback360NotFoundError extends Error {
  constructor(public readonly feedback360Id: number) {
    super(`Feedback360 not found: ${feedback360Id}`);
    this.name = 'Feedback360NotFoundError';
  }
}


