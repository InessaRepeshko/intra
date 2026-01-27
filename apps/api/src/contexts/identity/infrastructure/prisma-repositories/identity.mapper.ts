import {
  IdentityRole as PrismaIdentityRole,
  IdentityStatus as PrismaIdentityStatus,
  Role,
  User,
  UserRole,
} from '@intra/database';
import { IdentityRole } from '@intra/shared-kernel';
import { IdentityStatus } from '@intra/shared-kernel';
import { UserDomain } from '../../domain/user.domain';
import { RoleDomain } from '../../domain/role.domain';

export type UserWithRoles = User & { userRoles?: (UserRole & { role?: Role | null })[] };

export class IdentityMapper {
  static toUserDomain(user: UserWithRoles): UserDomain {
    const roles = (user.userRoles ?? []).map((relation) => relation.roleCode as IdentityRole);

    return UserDomain.create({
      id: user.id,
      firstName: user.firstName,
      secondName: user.secondName ?? undefined,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      passwordHash: user.passwordHash,
      status: user.status as IdentityStatus,
      positionId: user.positionId,
      teamId: user.teamId,
      managerId: user.managerId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles,
    });
  }

  static toRoleDomain(role: Role): RoleDomain {
    return new RoleDomain({
      id: role.id,
      code: role.code as IdentityRole,
      title: role.title,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    });
  }

  static toPrismaStatus(domainStatus: IdentityStatus): PrismaIdentityStatus {
    return domainStatus.toString() as PrismaIdentityStatus;
  }

  static toPrismaRole(domainRole: IdentityRole): PrismaIdentityRole {
    return domainRole.toString() as PrismaIdentityRole;
  }

  static fromPrismaStatus(prismaStatus: PrismaIdentityStatus): IdentityStatus {
    return prismaStatus.toString() as IdentityStatus;
  }

  static fromPrismaRole(prismaRole: PrismaIdentityRole): IdentityRole {
    return prismaRole.toString() as IdentityRole;
  }
}
