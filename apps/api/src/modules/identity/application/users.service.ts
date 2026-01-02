import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from './repository-ports/user.repository.port';
import type { UserRepositoryPort, UserSearchQuery, UserSearchResult } from './repository-ports/user.repository.port';
import { PasswordHasher } from './security-ports/password-hasher.port';
import { UserDomain } from '../domain/user/user.domain';
import { UsersStatus } from '../domain/user/users-status.enum';

export type CreateUserInput = {
  firstName: string;
  secondName?: string | null;
  lastName: string;
  email: string;
  password: string;
  positionId: number;
  teamId: number;
  managerId?: number | null;
};

export type UpdateUserInput = {
  firstName?: string;
  secondName?: string | null;
  lastName?: string;
  positionId?: number;
  teamId?: number;
  managerId?: number | null;
};

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly usersRepo: UserRepositoryPort,
  ) {}

  async create(input: CreateUserInput): Promise<UserDomain> {
    const passwordHash = PasswordHasher.hash(input.password);
    const secondName = input.secondName ?? null;
    const fullName = this.computeFullName(input.firstName, secondName, input.lastName);

    const user = new UserDomain({
      firstName: input.firstName,
      secondName,
      lastName: input.lastName,
      fullName,
      email: input.email,
      passwordHash,
      status: UsersStatus.ACTIVE,
      positionId: input.positionId,
      teamId: input.teamId,
      managerId: input.managerId ?? null,
    });

    return await this.usersRepo.create(user);
  }

  async findAll(): Promise<UserDomain[]> {
    return this.usersRepo.findAll();
  }

  async search(query?: UserSearchQuery): Promise<UserSearchResult> {
    return this.usersRepo.search(query);
  }

  async findOne(id: number): Promise<UserDomain> {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async findByEmail(email: string): Promise<UserDomain> {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async update(id: number, patch: UpdateUserInput): Promise<UserDomain> {
    const existing = await this.findOne(id);
    const shouldRecomputeFullName =
      patch.firstName !== undefined || patch.secondName !== undefined || patch.lastName !== undefined;

    const nextFirstName = patch.firstName !== undefined ? patch.firstName : existing.firstName;
    const nextSecondName = patch.secondName !== undefined ? patch.secondName : existing.secondName;
    const nextLastName = patch.lastName !== undefined ? patch.lastName : existing.lastName;
    const nextFullName = shouldRecomputeFullName ? this.computeFullName(nextFirstName, nextSecondName, nextLastName) : undefined;

    return this.usersRepo.updateById(
      id,
      { ...patch, ...(nextFullName !== undefined ? { fullName: nextFullName } : {}) },
    );
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.usersRepo.deleteById(id);
  }

  private computeFullName(firstName: string, secondName: string | null, lastName: string): string | null {
    return [firstName, secondName, lastName].filter(Boolean).join(' ') || null;
  }
}
