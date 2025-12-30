/**
 * Доменний enum стадій 360-оцінювання (не Prisma enum).
 *
 * Значення мають відповідати Prisma enum `feedback360_stage`.
 */
export enum Feedback360Stage {
  CANCELED = 'CANCELED',
  VERIFICATION_BY_HR = 'VERIFICATION_BY_HR',
  VERIFICATION_BY_USER = 'VERIFICATION_BY_USER',
  REJECTED = 'REJECTED',
  SELF_ASSESSMENT = 'SELF_ASSESSMENT',
  WAITING_TO_START = 'WAITING_TO_START',
  INPROGRESS = 'INPROGRESS',
  RESEARCH = 'RESEARCH',
  FINISHED = 'FINISHED',
}


