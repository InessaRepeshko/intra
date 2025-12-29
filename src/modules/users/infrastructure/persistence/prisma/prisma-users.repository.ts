import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/infrastructure/database/database.service';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { CreateUserData, UpdateUserData, User } from '../../../domain/model/user';
import { PrismaUserPersistenceMapper } from './prisma-user.persistence-mapper';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreateUserData): Promise<User> {
    const created = await this.db.user.create({ data: PrismaUserPersistenceMapper.toPrismaCreate(data) });
    return PrismaUserPersistenceMapper.toDomain(created);
  }

  async findAll(): Promise<User[]> {
    const users = await this.db.user.findMany();
    return users.map(PrismaUserPersistenceMapper.toDomain);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { id } });
    return user ? PrismaUserPersistenceMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { email } });
    return user ? PrismaUserPersistenceMapper.toDomain(user) : null;
  }

  async updateById(id: number, data: UpdateUserData): Promise<User> {
    const updated = await this.db.user.update({ where: { id }, data: PrismaUserPersistenceMapper.toPrismaUpdate(data) });
    return PrismaUserPersistenceMapper.toDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.db.user.delete({ where: { id } });
  }
}


