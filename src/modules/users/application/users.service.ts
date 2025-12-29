import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './infrastructure/persistence/prisma/users.repository';
import { User } from './infrastructure/http/presenters/user.entity';
import { PasswordHasher } from './domain/services/password-hasher';
import { UserMapper } from './domain/user.mapper';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const passwordHash = PasswordHasher.hash(createUserDto.password);
    const user = UserMapper.fromCreateDto(createUserDto, passwordHash);
    return await this.usersRepo.create(UserMapper.toPrismaCreate(user));
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
    const existing = await this.findOne(id);
    const patch = UserMapper.fromUpdateDto(updateUserDto);
    const shouldRecomputeFullName =
      patch.firstName !== undefined || patch.secondName !== undefined || patch.lastName !== undefined;

    const nextFirstName = patch.firstName !== undefined ? patch.firstName : existing.firstName;
    const nextSecondName = patch.secondName !== undefined ? patch.secondName : existing.secondName;
    const nextLastName = patch.lastName !== undefined ? patch.lastName : existing.lastName;
    const nextFullName = shouldRecomputeFullName
      ? [nextFirstName, nextSecondName, nextLastName].filter(Boolean).join(' ') || null
      : undefined;

    return await this.usersRepo.updateById(
      id,
      UserMapper.toPrismaUpdate({ ...patch, ...(nextFullName !== undefined ? { fullName: nextFullName } : {}) }),
    );
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.usersRepo.deleteById(id);
  }
}
