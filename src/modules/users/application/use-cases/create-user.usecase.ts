import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { USERS_REPOSITORY } from '../../domain/repositories/users.repository.token';
import { CreateUserRequest } from './create-user.request';
import { User } from '../../domain/model/user';
import { PasswordHasherPort } from '../../domain/services/password-hasher.port';
import { PASSWORD_HASHER } from '../../domain/services/password-hasher.token';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepo: UsersRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasherPort,
  ) {}

  async execute(req: CreateUserRequest): Promise<User> {
    const passwordHash = this.hasher.hash(req.password);
    const secondName = req.secondName ?? null;
    return this.usersRepo.create({
      firstName: req.firstName,
      secondName,
      lastName: req.lastName,
      fullName: User.computeFullName(req.firstName, secondName, req.lastName),
      email: req.email,
      passwordHash,
      positionId: req.positionId,
      teamId: req.teamId,
      managerId: req.managerId ?? null,
    });
  }
}


