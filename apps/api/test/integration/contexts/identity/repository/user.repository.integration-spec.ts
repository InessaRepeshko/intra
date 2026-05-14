import '../../../setup-env';

import {
    IdentityRole,
    IdentityStatus,
    SortDirection,
    UserSortField,
} from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { UserRepository } from 'src/contexts/identity/infrastructure/prisma-repositories/user.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createIdentityTestModule,
    ensureRolesSeeded,
    resetIdentityTables,
} from '../test-app-identity';

function buildUserDomain(
    overrides: Partial<Parameters<typeof UserDomain.create>[0]> = {},
): UserDomain {
    return UserDomain.create({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        fullName: 'Jane Doe',
        ...overrides,
    });
}

describe('UserRepository (integration)', () => {
    let module: TestingModule;
    let repo: UserRepository;
    let prisma: PrismaService;

    beforeAll(async () => {
        module = await createIdentityTestModule();
        repo = module.get(UserRepository);
        prisma = module.get(PrismaService);
        await ensureRolesSeeded(prisma);
    });

    beforeEach(async () => {
        await resetIdentityTables(prisma);
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create', () => {
        it('persists a new user with all attributes', async () => {
            const created = await repo.create(
                buildUserDomain({
                    firstName: 'Anna',
                    secondName: 'M.',
                    lastName: 'Smith',
                    fullName: 'Anna M. Smith',
                    email: 'anna.m.smith@example.com',
                    status: IdentityStatus.ACTIVE,
                }),
            );

            expect(created.id).toBeDefined();
            expect(created.firstName).toBe('Anna');
            expect(created.secondName).toBe('M.');

            const fromDb = await prisma.user.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).not.toBeNull();
            expect(fromDb!.secondName).toBe('M.');
        });

        it('persists assigned roles via the userRoles relation', async () => {
            const created = await repo.create(
                buildUserDomain({
                    email: 'roles.test@example.com',
                    roles: [IdentityRole.HR, IdentityRole.MANAGER],
                }),
            );

            const rows = await prisma.userRole.findMany({
                where: { userId: created.id! },
            });
            expect(rows.map((r) => r.roleCode).sort()).toEqual(
                ['HR', 'MANAGER'].sort(),
            );
        });
    });

    describe('findById', () => {
        it('returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });

        it('returns the user without roles when withRoles is not requested', async () => {
            const created = await repo.create(
                buildUserDomain({
                    email: 'find-by-id@example.com',
                    roles: [IdentityRole.ADMIN],
                }),
            );

            const fetched = await repo.findById(created.id!);
            expect(fetched).not.toBeNull();
            expect(fetched!.roles).toEqual([]);
        });

        it('returns the user with roles when withRoles is requested', async () => {
            const created = await repo.create(
                buildUserDomain({
                    email: 'find-by-id-roles@example.com',
                    roles: [IdentityRole.ADMIN, IdentityRole.HR],
                }),
            );

            const fetched = await repo.findById(created.id!, {
                withRoles: true,
            });
            expect(fetched!.roles.sort()).toEqual(
                [IdentityRole.ADMIN, IdentityRole.HR].sort(),
            );
        });
    });

    describe('findByEmail', () => {
        it('returns the user found by email', async () => {
            await repo.create(
                buildUserDomain({ email: 'find-by-email@example.com' }),
            );

            const fetched = await repo.findByEmail('find-by-email@example.com');
            expect(fetched?.email).toBe('find-by-email@example.com');
        });

        it('returns null when no user has the email', async () => {
            await expect(
                repo.findByEmail('nobody@example.com'),
            ).resolves.toBeNull();
        });
    });

    describe('search', () => {
        beforeEach(async () => {
            await repo.create(
                buildUserDomain({
                    firstName: 'Alice',
                    lastName: 'Brown',
                    fullName: 'Alice Brown',
                    email: 'alice@example.com',
                }),
            );
            await repo.create(
                buildUserDomain({
                    firstName: 'Bob',
                    lastName: 'Green',
                    fullName: 'Bob Green',
                    email: 'bob@example.com',
                    status: IdentityStatus.INACTIVE,
                }),
            );
            await repo.create(
                buildUserDomain({
                    firstName: 'Carol',
                    lastName: 'Brown',
                    fullName: 'Carol Brown',
                    email: 'carol@example.com',
                }),
            );
        });

        it('returns all users with default ordering (ascending by id)', async () => {
            const all = await repo.search({} as any);

            expect(all).toHaveLength(3);
            const ids = all.map((u) => u.id!);
            expect(ids).toEqual([...ids].sort((a, b) => a - b));
        });

        it('filters by lastName (case insensitive substring)', async () => {
            const result = await repo.search({ lastName: 'BROWN' } as any);

            expect(result.map((u) => u.email).sort()).toEqual([
                'alice@example.com',
                'carol@example.com',
            ]);
        });

        it('filters by status', async () => {
            const inactive = await repo.search({
                status: IdentityStatus.INACTIVE,
            } as any);

            expect(inactive.map((u) => u.email)).toEqual(['bob@example.com']);
        });

        it('filters by the `search` field across firstName / lastName / fullName / email', async () => {
            const byEmail = await repo.search({
                search: 'alice@',
            } as any);
            expect(byEmail.map((u) => u.email)).toEqual(['alice@example.com']);

            const byName = await repo.search({ search: 'Carol' } as any);
            expect(byName.map((u) => u.email)).toEqual(['carol@example.com']);
        });

        it('honours descending sort direction on email', async () => {
            const result = await repo.search({
                sortBy: UserSortField.EMAIL,
                sortDirection: SortDirection.DESC,
            } as any);

            const emails = result.map((u) => u.email);
            expect(emails).toEqual([...emails].sort().reverse());
        });
    });

    describe('updateById', () => {
        it('updates only the fields supplied in the patch', async () => {
            const created = await repo.create(
                buildUserDomain({ email: 'update@example.com' }),
            );

            const updated = await repo.updateById(created.id!, {
                firstName: 'Updated',
                fullName: 'Updated Doe',
            } as any);

            expect(updated.firstName).toBe('Updated');
            expect(updated.fullName).toBe('Updated Doe');

            const fromDb = await prisma.user.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.firstName).toBe('Updated');
        });

        it('coerces null teamId/managerId/secondName to null in the database', async () => {
            const created = await repo.create(
                buildUserDomain({
                    email: 'null-fields@example.com',
                    secondName: 'M.',
                }),
            );

            await repo.updateById(created.id!, {
                secondName: undefined,
                teamId: undefined,
                managerId: undefined,
            } as any);

            const fromDb = await prisma.user.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.secondName).toBeNull();
            expect(fromDb!.teamId).toBeNull();
            expect(fromDb!.managerId).toBeNull();
        });
    });

    describe('deleteById', () => {
        it('removes the user row from the database', async () => {
            const created = await repo.create(
                buildUserDomain({ email: 'delete@example.com' }),
            );

            await repo.deleteById(created.id!);

            const fromDb = await prisma.user.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });
    });

    describe('replaceRoles', () => {
        it('inserts new roles when none existed', async () => {
            const created = await repo.create(
                buildUserDomain({ email: 'roles-insert@example.com' }),
            );

            const result = await repo.replaceRoles(created.id!, [
                IdentityRole.HR,
                IdentityRole.ADMIN,
            ]);

            expect(result.roles.sort()).toEqual(
                [IdentityRole.ADMIN, IdentityRole.HR].sort(),
            );

            const rows = await prisma.userRole.findMany({
                where: { userId: created.id! },
            });
            expect(rows).toHaveLength(2);
        });

        it('removes roles that are no longer in the requested list', async () => {
            const created = await repo.create(
                buildUserDomain({
                    email: 'roles-remove@example.com',
                    roles: [IdentityRole.HR, IdentityRole.MANAGER],
                }),
            );

            const result = await repo.replaceRoles(created.id!, [
                IdentityRole.MANAGER,
            ]);

            expect(result.roles).toEqual([IdentityRole.MANAGER]);
            const rows = await prisma.userRole.findMany({
                where: { userId: created.id! },
            });
            expect(rows).toHaveLength(1);
            expect(rows[0].roleCode).toBe('MANAGER');
        });

        it('clears all roles when given an empty list', async () => {
            const created = await repo.create(
                buildUserDomain({
                    email: 'roles-clear@example.com',
                    roles: [IdentityRole.HR],
                }),
            );

            const result = await repo.replaceRoles(created.id!, []);

            expect(result.roles).toEqual([]);
            const rows = await prisma.userRole.findMany({
                where: { userId: created.id! },
            });
            expect(rows).toEqual([]);
        });

        it('is idempotent when the same role set is reapplied', async () => {
            const created = await repo.create(
                buildUserDomain({
                    email: 'roles-idempotent@example.com',
                    roles: [IdentityRole.HR, IdentityRole.ADMIN],
                }),
            );

            await repo.replaceRoles(created.id!, [
                IdentityRole.HR,
                IdentityRole.ADMIN,
            ]);
            const result = await repo.replaceRoles(created.id!, [
                IdentityRole.HR,
                IdentityRole.ADMIN,
            ]);

            expect(result.roles.sort()).toEqual(
                [IdentityRole.ADMIN, IdentityRole.HR].sort(),
            );
            const rows = await prisma.userRole.findMany({
                where: { userId: created.id! },
            });
            expect(rows).toHaveLength(2);
        });
    });
});
