import { Injectable } from '@nestjs/common';
import { User } from '../domain/model/user';
import { CreateUserRequest } from './use-cases/create-user.request';
import { UpdateUserRequest } from './use-cases/update-user.request';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { UsersRepository } from '../domain/repositories/users.repository';
import { Inject } from '@nestjs/common';
import { USERS_REPOSITORY } from '../domain/repositories/users.repository.token';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';

@Injectable()
export class UsersApplicationService {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    @Inject(USERS_REPOSITORY) private readonly usersRepo: UsersRepository,
  ) {}

  async create(req: CreateUserRequest): Promise<User> {
    return this.createUser.execute(req);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepo.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new UserNotFoundError(id);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) throw new UserNotFoundError(email);
    return user;
  }

  async update(id: number, req: UpdateUserRequest): Promise<User> {
    return this.updateUser.execute(id, req);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.usersRepo.deleteById(id);
  }
}


