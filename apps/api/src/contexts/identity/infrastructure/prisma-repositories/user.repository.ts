import { Injectable } from '@nestjs/common';
import { Prisma, IdentityUsersStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepositoryPort, UserSearchQuery, UserSortField, UserUpdatePayload } from '../../application/ports/user.repository.port';
import { UserDomain } from '../../domain/user.domain';
import { IdentityMapper, UserWithRoles } from './identity.mapper';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { IdentityRole } from '../../domain/identity-role.enum';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: UserDomain): Promise<UserDomain> {
    const created = await this.prisma.user.create({
      data: {
        firstName: user.firstName,
        secondName: user.secondName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        passwordHash: user.passwordHash,
        status: user.status as IdentityUsersStatus,
        positionId: user.positionId,
        teamId: user.teamId,
        managerId: user.managerId,
        ...(user.roles.length
          ? {
              userRoles: {
                createMany: {
                  data: user.roles.map((roleCode) => ({ roleCode })),
                },
              },
            }
          : {}),
      },
      include: this.withRolesInclude(true),
    });

    return IdentityMapper.toUserDomain(created);
  }

  async findById(id: number, opts?: { withRoles?: boolean }): Promise<UserDomain | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: this.withRolesInclude(opts?.withRoles),
    });

    return user ? IdentityMapper.toUserDomain(user) : null;
  }

  async search(query: UserSearchQuery): Promise<UserDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);

    const items = await this.prisma.user.findMany({
      where,
      orderBy,
      include: this.withRolesInclude(true),
    });

    return items.map((u) => IdentityMapper.toUserDomain(u as UserWithRoles));
  }

  async updateById(id: number, patch: UserUpdatePayload): Promise<UserDomain> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: patch,
      include: this.withRolesInclude(true),
    });

    return IdentityMapper.toUserDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async replaceRoles(userId: number, roles: IdentityRole[]): Promise<UserDomain> {
    await this.prisma.$transaction(async (tx) => {
      const deleteWhere: Prisma.UserRoleWhereInput = roles.length
        ? { userId, NOT: { roleCode: { in: roles } } }
        : { userId };

      await tx.userRole.deleteMany({ where: deleteWhere });

      const existing = await tx.userRole.findMany({ where: { userId } });
      const existingCodes = new Set(existing.map((r) => r.roleCode));
      const toCreate = roles.filter((role) => !existingCodes.has(role));

      if (toCreate.length) {
        await tx.userRole.createMany({
          data: toCreate.map((roleCode) => ({ userId, roleCode })),
          skipDuplicates: true,
        });
      }
    });

    const refreshed = await this.findById(userId, { withRoles: true });
    if (!refreshed) {
      throw new Error('User not found after roles update');
    }
    return refreshed;
  }

  private buildWhere(query: UserSearchQuery): Prisma.UserWhereInput {
    const { search, email, status, teamId, positionId, managerId } = query;

    return {
      ...(email ? { email } : {}),
      ...(status ? { status } : {}),
      ...(teamId ? { teamId } : {}),
      ...(positionId ? { positionId } : {}),
      ...(managerId ? { managerId } : {}),
      ...(search
        ? {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { email: { contains: search } },
              { fullName: { contains: search } },
            ],
          }
        : {}),
    };
  }

  private buildOrder(query: UserSearchQuery): Prisma.UserOrderByWithRelationInput[] {
    const field = query.sortBy ?? UserSortField.CREATED_AT;
    const direction = query.sortDirection ?? SortDirection.DESC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }

  private withRolesInclude(withRoles?: boolean) {
    if (!withRoles) return undefined;
    return {
      userRoles: {
        select: { roleCode: true },
      },
    };
  }
}
