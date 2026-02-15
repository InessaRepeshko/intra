import {
    Prisma,
    IdentityStatus as PrismaIdentityStatus,
    Role,
    User,
    UserRole,
} from '@intra/database';
import { IdentityStatus } from '@intra/shared-kernel';
import { UserDomain } from '../../domain/user.domain';
import { RoleMapper } from './role.mapper';

export type UserWithRoles = User & {
    userRoles?: (UserRole & { role?: Role | null })[];
};

export class UserMapper {
    static toDomain(user: UserWithRoles): UserDomain {
        const roles = (user.userRoles ?? []).map((relation) =>
            RoleMapper.fromPrismaRole(relation.roleCode),
        );

        return UserDomain.create({
            id: user.id,
            firstName: user.firstName,
            secondName: user.secondName ?? undefined,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            avatarUrl: user.avatarUrl,
            status: UserMapper.toDomainStatus(user.status),
            positionId: user.positionId,
            teamId: user.teamId,
            managerId: user.managerId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            roles,
        });
    }

    static toPrisma(user: UserDomain): Prisma.UserUncheckedCreateInput {
        return {
            firstName: user.firstName,
            secondName: user.secondName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            avatarUrl: user.avatarUrl,
            status: UserMapper.toPrismaStatus(user.status),
            positionId: user.positionId ?? null,
            teamId: user.teamId,
            managerId: user.managerId,
            ...(user.roles.length
                ? {
                      userRoles: {
                          createMany: {
                              data: user.roles.map((roleCode) => ({
                                  roleCode,
                              })),
                          },
                      },
                  }
                : {}),
        };
    }

    static toPrismaStatus(domainStatus: IdentityStatus): PrismaIdentityStatus {
        return domainStatus.toString().toUpperCase() as PrismaIdentityStatus;
    }

    static toDomainStatus(prismaStatus: PrismaIdentityStatus): IdentityStatus {
        return prismaStatus.toString().toUpperCase() as IdentityStatus;
    }
}
