import { User as PrismaUser } from '@intra/database';
import { IdentityRole, IdentityStatus } from '@intra/shared-kernel';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { UserMapper } from 'src/contexts/identity/infrastructure/mappers/user.mapper';

describe('UserMapper', () => {
    const prismaUser = {
        id: 1,
        firstName: 'Jane',
        secondName: 'M.',
        lastName: 'Doe',
        fullName: 'Jane M. Doe',
        email: 'jane@example.com',
        avatarUrl: 'https://example.com/a.png',
        status: 'ACTIVE' as PrismaUser['status'],
        positionId: 3,
        teamId: 4,
        managerId: 5,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    } as PrismaUser;

    describe('toDomain', () => {
        it('converts a prisma user into a UserDomain with empty roles when none are linked', () => {
            const domain = UserMapper.toDomain(prismaUser);

            expect(domain).toBeInstanceOf(UserDomain);
            expect(domain.id).toBe(1);
            expect(domain.firstName).toBe('Jane');
            expect(domain.secondName).toBe('M.');
            expect(domain.lastName).toBe('Doe');
            expect(domain.fullName).toBe('Jane M. Doe');
            expect(domain.status).toBe(IdentityStatus.ACTIVE);
            expect(domain.positionId).toBe(3);
            expect(domain.teamId).toBe(4);
            expect(domain.managerId).toBe(5);
            expect(domain.roles).toEqual([]);
        });

        it('converts userRoles relations into IdentityRole values', () => {
            const domain = UserMapper.toDomain({
                ...prismaUser,
                userRoles: [{ roleCode: 'HR' }, { roleCode: 'ADMIN' }],
            } as any);

            expect(domain.roles).toEqual([
                IdentityRole.HR,
                IdentityRole.ADMIN,
            ]);
        });

        it('converts null secondName to undefined on the domain side', () => {
            const domain = UserMapper.toDomain({
                ...prismaUser,
                secondName: null,
            } as unknown as PrismaUser);

            expect(domain.secondName).toBeUndefined();
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain without roles into a Prisma create input', () => {
            const domain = UserDomain.create({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
            });

            const prisma = UserMapper.toPrisma(domain);

            expect(prisma.firstName).toBe('Jane');
            expect(prisma.lastName).toBe('Doe');
            expect(prisma.email).toBe('jane@example.com');
            expect(prisma.status).toBe('ACTIVE');
            expect(prisma.positionId).toBeNull();
            expect(prisma.teamId).toBeNull();
            expect(prisma.managerId).toBeNull();
            expect((prisma as any).userRoles).toBeUndefined();
        });

        it('emits a userRoles.createMany block when roles are present', () => {
            const domain = UserDomain.create({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                roles: [IdentityRole.HR, IdentityRole.MANAGER],
            });

            const prisma = UserMapper.toPrisma(domain);

            expect(prisma.userRoles).toEqual({
                createMany: {
                    data: [
                        { roleCode: IdentityRole.HR },
                        { roleCode: IdentityRole.MANAGER },
                    ],
                },
            });
        });
    });

    describe('status conversions', () => {
        it('uppercases identity status in both directions', () => {
            expect(UserMapper.toPrismaStatus(IdentityStatus.ACTIVE)).toBe(
                'ACTIVE',
            );
            expect(
                UserMapper.toDomainStatus(
                    'INACTIVE' as PrismaUser['status'],
                ),
            ).toBe(IdentityStatus.INACTIVE);
        });
    });
});
