import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { User } from './entities/user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(data: Partial<User>): Promise<User> {
    return this.db.user.create({ data: data as Prisma.UserUncheckedCreateInput });
  }

  async findAll(): Promise<User[]> {
    return this.db.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  async updateById(id: number, data: Partial<User>): Promise<User> {
    return this.db.user.update({ where: { id }, data: data as Prisma.UserUncheckedUpdateInput });
  }

  async deleteById(id: number): Promise<User> {
    return this.db.user.delete({ where: { id } });
  }
}
