import {
  IdentityRole as PrismaIdentityRole,
  IdentityUsersStatus as PrismaIdentityUserStatus,
  Role,
  User,
  UserRole,
} from '@intra/database';
import { IdentityRole } from '../../domain/identity-role.enum';
import { IdentityUserStatus } from '../../domain/identity-user-status.enum';
import { UserDomain } from '../../domain/user.domain';
import { RoleDomain } from '../../domain/role.domain';

export type UserWithRoles = User & { userRoles?: (UserRole & { role?: Role | null })[] };

export class IdentityMapper {
  static toUserDomain(user: UserWithRoles): UserDomain {
    const roles = (user.userRoles ?? []).map((relation) => relation.roleCode as IdentityRole);

    return UserDomain.create({
      id: user.id,
      firstName: user.firstName,
      secondName: user.secondName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      passwordHash: user.passwordHash,
      status: user.status as IdentityUserStatus,
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

  static fromStatus(status?: IdentityUserStatus): PrismaIdentityUserStatus | undefined {
    return status as PrismaIdentityUserStatus | undefined;
  }

  static fromRole(role: IdentityRole): PrismaIdentityRole | undefined {
    return role as PrismaIdentityRole | undefined;
  }
}
