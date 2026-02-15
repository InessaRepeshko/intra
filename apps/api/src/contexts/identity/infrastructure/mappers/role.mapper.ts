import { IdentityRole as PrismaIdentityRole, Role } from '@intra/database';
import { IdentityRole } from '@intra/shared-kernel';
import { RoleDomain } from '../../domain/role.domain';

export class RoleMapper {
    static toDomain(role: Role): RoleDomain {
        return new RoleDomain({
            id: role.id,
            code: RoleMapper.fromPrismaRole(role.code),
            title: role.title,
            description: role.description,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        });
    }

    static toPrismaRole(domainRole: IdentityRole): PrismaIdentityRole {
        return domainRole.toString().toUpperCase() as PrismaIdentityRole;
    }

    static fromPrismaRole(prismaRole: PrismaIdentityRole): IdentityRole {
        return prismaRole.toString().toUpperCase() as IdentityRole;
    }
}
