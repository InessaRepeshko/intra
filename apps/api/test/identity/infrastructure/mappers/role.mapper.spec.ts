import { Role as PrismaRole } from '@intra/database';
import { IdentityRole } from '@intra/shared-kernel';
import { RoleDomain } from 'src/contexts/identity/domain/role.domain';
import { RoleMapper } from 'src/contexts/identity/infrastructure/mappers/role.mapper';

describe('RoleMapper', () => {
    const prismaRole = {
        id: 1,
        code: 'HR' as PrismaRole['code'],
        title: 'HR',
        description: 'Human resources',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    } as PrismaRole;

    describe('toDomain', () => {
        it('converts a prisma role into a RoleDomain', () => {
            const domain = RoleMapper.toDomain(prismaRole);

            expect(domain).toBeInstanceOf(RoleDomain);
            expect(domain.id).toBe(1);
            expect(domain.code).toBe(IdentityRole.HR);
            expect(domain.title).toBe('HR');
            expect(domain.description).toBe('Human resources');
        });
    });

    describe('toPrismaRole / fromPrismaRole', () => {
        it('uppercases the role code in both directions', () => {
            expect(RoleMapper.toPrismaRole(IdentityRole.ADMIN)).toBe('ADMIN');
            expect(
                RoleMapper.fromPrismaRole('EMPLOYEE' as PrismaRole['code']),
            ).toBe(IdentityRole.EMPLOYEE);
        });
    });
});
