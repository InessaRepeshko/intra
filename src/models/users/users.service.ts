import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepo.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepo.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    return await this.usersRepo.updateById(
      id,
      updateUserDto,
    );
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.usersRepo.deleteById(id);
  }
}
