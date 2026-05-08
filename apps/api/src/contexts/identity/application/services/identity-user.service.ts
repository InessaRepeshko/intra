<<<<<<< HEAD
import {
    CreateUserPayload,
    IdentityRole,
    IdentityStatus,
    UpdateUserPayload,
    UserSearchQuery,
} from '@intra/shared-kernel';
import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UserDomain } from '../../domain/user.domain';
import type { RoleRepositoryPort } from '../ports/role.repository.port';
import { IDENTITY_ROLE_REPOSITORY } from '../ports/role.repository.port';
import type { UserRepositoryPort } from '../ports/user.repository.port';
import { IDENTITY_USER_REPOSITORY } from '../ports/user.repository.port';

export type UpdateUserCommand = Partial<Omit<CreateUserPayload, 'email'>>;

@Injectable()
export class IdentityUserService {
    constructor(
        @Inject(IDENTITY_USER_REPOSITORY)
        private readonly users: UserRepositoryPort,
        @Inject(IDENTITY_ROLE_REPOSITORY)
        private readonly roles: RoleRepositoryPort,
    ) {}

    async create(payload: CreateUserPayload): Promise<UserDomain> {
        const user = UserDomain.create({
            firstName: payload.firstName,
            secondName: payload.secondName,
            lastName: payload.lastName,
            fullName:
                payload.fullName ??
                this.buildFullName(
                    payload.lastName,
                    payload.firstName,
                    payload.secondName,
                ),
            email: payload.email,
            avatarUrl: payload.avatarUrl,
            status: payload.status ?? IdentityStatus.ACTIVE,
            positionId: payload.positionId ?? null,
            teamId: payload.teamId ?? null,
            managerId: payload.managerId ?? null,
            roles: payload.roles ?? [],
        });

        return this.users.create(user);
    }

    async search(query: UserSearchQuery): Promise<UserDomain[]> {
        return this.users.search(query);
    }

    async getById(
        id: number,
        opts?: { withRoles?: boolean },
    ): Promise<UserDomain> {
        const user = await this.users.findById(id, opts);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async findByEmail(
        email: string,
        opts?: { withRoles?: boolean },
    ): Promise<UserDomain | null> {
        return this.users.findByEmail(email, opts);
    }

    async update(id: number, patch: UpdateUserCommand): Promise<UserDomain> {
        const current = await this.getById(id);
        const shouldUpdateFullName =
            patch.firstName !== undefined ||
            patch.secondName !== undefined ||
            patch.lastName !== undefined;

        const fullName = shouldUpdateFullName
            ? this.buildFullName(
                  patch.lastName ?? current.lastName,
                  patch.firstName ?? current.firstName,
                  patch.secondName ?? current.secondName,
              )
            : undefined;

        const payload: UpdateUserPayload = {
            ...patch,
            ...(fullName !== undefined ? { fullName } : {}),
        };

        return this.users.updateById(id, payload);
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        await this.users.deleteById(id);
    }

    async replaceRoles(
        userId: number,
        roles: IdentityRole[],
    ): Promise<UserDomain> {
        await this.getById(userId);

        const uniqueRoles = Array.from(new Set(roles));
        const found = await this.roles.findByCodes(uniqueRoles);
        if (found.length !== uniqueRoles.length) {
            const foundCodes = new Set(found.map((r) => r.code));
            const missing = uniqueRoles.filter((c) => !foundCodes.has(c));
            throw new BadRequestException(
                `Unknown roles: ${missing.join(', ')}`,
            );
        }

        return this.users.replaceRoles(userId, uniqueRoles);
    }

    async upsertExternalUser(payload: {
        email: string;
        firstName: string;
        lastName: string;
        secondName: string | undefined;
        avatarUrl?: string;
    }): Promise<UserDomain> {
        const existing = await this.users.findByEmail(payload.email, {
            withRoles: true,
        });

        if (existing) {
            return existing;
        }

        const createdUser = UserDomain.create({
            firstName: payload.firstName,
            secondName: payload.secondName,
            lastName: payload.lastName,
            fullName: this.buildFullName(
                payload.lastName,
                payload.firstName,
                payload.secondName,
            ),
            email: payload.email,
            avatarUrl: payload.avatarUrl,
            status: IdentityStatus.ACTIVE,
            positionId: null,
            teamId: null,
            managerId: null,
            roles: [IdentityRole.EMPLOYEE],
        });

        return this.users.create(createdUser);
    }

    private buildFullName(
        lastName: string,
        firstName: string,
        secondName: string | undefined,
    ): string {
        const parts = [lastName, firstName, secondName ?? undefined].filter(
            Boolean,
        );
        return parts.join(' ');
    }
}
=======
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { RoleRepositoryPort } from '../ports/role.repository.port';
import { IDENTITY_ROLE_REPOSITORY } from '../ports/role.repository.port';
import type { UserRepositoryPort } from '../ports/user.repository.port';
import {
  IDENTITY_USER_REPOSITORY,
  UserSearchQuery,
  UserUpdatePayload,
} from '../ports/user.repository.port';
import { IdentityUserStatus } from '../../domain/identity-user-status.enum';
import { IdentityRole } from '../../domain/identity-role.enum';
import { UserDomain } from '../../domain/user.domain';

export type CreateUserCommand = {
  firstName: string;
  secondName?: string | null;
  lastName: string;
  email: string;
  passwordHash?: string;
  status?: IdentityUserStatus;
  positionId?: number | null;
  teamId?: number | null;
  managerId?: number | null;
};

export type UpdateUserCommand = Partial<Omit<CreateUserCommand, 'email'>>;

const PASSWORD_PLACEHOLDER = '__external_auth__';

@Injectable()
export class IdentityUserService {
  constructor(
    @Inject(IDENTITY_USER_REPOSITORY) private readonly users: UserRepositoryPort,
    @Inject(IDENTITY_ROLE_REPOSITORY) private readonly roles: RoleRepositoryPort,
  ) {}

  async create(command: CreateUserCommand): Promise<UserDomain> {
    const user = UserDomain.create({
      firstName: command.firstName,
      secondName: command.secondName ?? null,
      lastName: command.lastName,
      email: command.email,
      passwordHash: command.passwordHash ?? PASSWORD_PLACEHOLDER,
      status: command.status ?? IdentityUserStatus.ACTIVE,
      positionId: command.positionId ?? null,
      teamId: command.teamId ?? null,
      managerId: command.managerId ?? null,
    });

    return this.users.create(user);
  }

  async search(query: UserSearchQuery): Promise<UserDomain[]> {
    return this.users.search(query);
  }

  async getById(id: number, opts?: { withRoles?: boolean }): Promise<UserDomain> {
    const user = await this.users.findById(id, opts);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, patch: UpdateUserCommand): Promise<UserDomain> {
    const current = await this.getById(id);
    const shouldUpdateFullName =
      patch.firstName !== undefined || patch.secondName !== undefined || patch.lastName !== undefined;

    const fullName = shouldUpdateFullName
      ? this.buildFullName(
          patch.firstName ?? current.firstName,
          patch.secondName ?? current.secondName,
          patch.lastName ?? current.lastName,
        )
      : undefined;

    const payload: UserUpdatePayload = {
      ...patch,
      ...(fullName !== undefined ? { fullName } : {}),
    };

    return this.users.updateById(id, payload);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.users.deleteById(id);
  }

  async replaceRoles(userId: number, roles: IdentityRole[]): Promise<UserDomain> {
    await this.getById(userId);

    const uniqueRoles = Array.from(new Set(roles));
    const found = await this.roles.findByCodes(uniqueRoles);
    if (found.length !== uniqueRoles.length) {
      const foundCodes = new Set(found.map((r) => r.code));
      const missing = uniqueRoles.filter((c) => !foundCodes.has(c));
      throw new BadRequestException(`Unknown roles: ${missing.join(', ')}`);
    }

    return this.users.replaceRoles(userId, uniqueRoles);
  }

  private buildFullName(firstName: string, secondName: string | null, lastName: string): string | null {
    const parts = [firstName, secondName ?? undefined, lastName].filter(Boolean);
    return parts.length ? parts.join(' ') : null;
  }
}
>>>>>>> origin/main
