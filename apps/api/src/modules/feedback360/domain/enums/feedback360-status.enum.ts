/**
 * Доменний enum статусу заповнення (не Prisma enum).
 *
 * Відповідає Prisma enum `feedback360_status`.
 */
export enum Feedback360Status {
  PENDING = 'PENDING',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}


