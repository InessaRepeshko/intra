import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { SERIALIZATION_GROUPS, User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return plainToInstance(User, await this.usersRepo.create(createUserDto), { groups: SERIALIZATION_GROUPS.CONFIDENTIAL });
  }

  async findAll(): Promise<User[]> {
    return plainToInstance(User, await this.usersRepo.findAll(), { groups: SERIALIZATION_GROUPS.BASIC });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException(`User not found`);
    return plainToInstance(User, user, { groups: SERIALIZATION_GROUPS.BASIC });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) throw new NotFoundException(`User not found`);
    return plainToInstance(User, user, { groups: SERIALIZATION_GROUPS.BASIC });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    return plainToInstance(User, await this.usersRepo.updateById(id, updateUserDto), { groups: SERIALIZATION_GROUPS.CONFIDENTIAL });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.usersRepo.deleteById(id);
  }
}
