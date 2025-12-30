import { UserDomain } from '../../domain/user/user.domain';

/**
 * Порт репозиторію користувачів (application -> infrastructure).
 *
 * Важливо:
 * - без Prisma-типів
 * - без NestJS-декораторів
 * - DI токен має бути runtime-значенням (symbol/string), не TS interface
 */
export const USER_REPOSITORY = Symbol('IDENTITY.USER_REPOSITORY');

export interface UserRepositoryPort {
  create(user: UserDomain): Promise<UserDomain>;
  findAll(): Promise<UserDomain[]>;
  findById(id: number): Promise<UserDomain | null>;
  findByEmail(email: string): Promise<UserDomain | null>;
  updateById(id: number, patch: Partial<UserDomain>): Promise<UserDomain>;
  deleteById(id: number): Promise<void>;
}


