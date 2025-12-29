import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { USERS_REPOSITORY } from '../../domain/repositories/users.repository.token';
import { UpdateUserRequest } from './update-user.request';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { UpdateUserData, User } from '../../domain/model/user';

@Injectable()
export class UpdateUserUseCase {
  constructor(@Inject(USERS_REPOSITORY) private readonly usersRepo: UsersRepository) {}

  async execute(userId: number, req: UpdateUserRequest): Promise<User> {
    const existing = await this.usersRepo.findById(userId);
    if (!existing) throw new UserNotFoundError(userId);

    const patch: UpdateUserData = {
      ...(req.firstName !== undefined ? { firstName: req.firstName } : {}),
      ...(req.secondName !== undefined ? { secondName: req.secondName } : {}),
      ...(req.lastName !== undefined ? { lastName: req.lastName } : {}),
      ...(req.positionId !== undefined ? { positionId: req.positionId } : {}),
      ...(req.teamId !== undefined ? { teamId: req.teamId } : {}),
      ...(req.managerId !== undefined ? { managerId: req.managerId } : {}),
    };

    const shouldRecomputeFullName =
      patch.firstName !== undefined || patch.secondName !== undefined || patch.lastName !== undefined;
    if (shouldRecomputeFullName) {
      const nextFirstName = patch.firstName ?? existing.firstName;
      const nextSecondName = patch.secondName ?? existing.secondName;
      const nextLastName = patch.lastName ?? existing.lastName;
      patch.fullName = User.computeFullName(nextFirstName, nextSecondName, nextLastName);
    }

    return this.usersRepo.updateById(userId, patch);
  }
}


