/**
 * Доменний статус користувача (не Prisma enum).
 *
 * Важливо: значення мають відповідати prisma enum `users_status`,
 * але сам домен не має імпортувати `@prisma/client`.
 */
export enum UsersStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
}


