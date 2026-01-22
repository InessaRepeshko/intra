export enum ResponseStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export const RESPONSE_STATUSES = Object.values(ResponseStatus);
