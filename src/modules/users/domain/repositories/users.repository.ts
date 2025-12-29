import { CreateUserData, UpdateUserData, User } from '../model/user';

/**
 * Доменний порт репозиторію користувачів (без Prisma/Nest/HTTP).
 *
 * Для DI в Nest використовуй `USERS_REPOSITORY` токен.
 */
export interface UsersRepository {
  create(data: CreateUserData): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updateById(id: number, data: UpdateUserData): Promise<User>;
  deleteById(id: number): Promise<void>;
}


