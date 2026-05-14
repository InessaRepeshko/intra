import '../../../setup-env';

import { IdentityRole, IdentityStatus } from '@intra/shared-kernel';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TestingModule } from '@nestjs/testing';
import { UserCreatedEvent } from 'src/contexts/identity/application/events/user-created.event';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { PrismaService } from 'src/database/prisma.service';
import {
    createIdentityTestModule,
    ensureRolesSeeded,
    resetIdentityTables,
} from '../test-app-identity';

describe('IdentityUserService (integration)', () => {
    let module: TestingModule;
    let service: IdentityUserService;
    let prisma: PrismaService;
    let eventEmitter: EventEmitter2;

    beforeAll(async () => {
        module = await createIdentityTestModule();
        service = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
        eventEmitter = module.get(EventEmitter2);
        await ensureRolesSeeded(prisma);
    });

    beforeEach(async () => {
        await resetIdentityTables(prisma);
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create', () => {
        it('persists a new user with default status and no roles', async () => {
            const created = await service.create({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
            } as any);

            expect(created.id).toBeDefined();
            expect(created.firstName).toBe('Jane');
            expect(created.lastName).toBe('Doe');
            expect(created.fullName).toBe('Doe Jane');
            expect(created.status).toBe(IdentityStatus.ACTIVE);
            expect(created.roles).toEqual([]);

            const fromDb = await prisma.user.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).not.toBeNull();
            expect(fromDb!.email).toBe('jane.doe@example.com');
        });

        it('persists a user together with the requested roles', async () => {
            const created = await service.create({
                firstName: 'Anna',
                lastName: 'Smith',
                email: 'anna.smith@example.com',
                roles: [IdentityRole.HR, IdentityRole.MANAGER],
            } as any);

            const roleRows = await prisma.userRole.findMany({
                where: { userId: created.id! },
                orderBy: { roleCode: 'asc' },
            });
            expect(roleRows.map((r) => r.roleCode).sort()).toEqual(
                ['HR', 'MANAGER'].sort(),
            );
        });

        it('emits a user.created event with the persisted id and email', async () => {
            const listener = jest.fn();
            eventEmitter.on('user.created', listener);

            try {
                const created = await service.create({
                    firstName: 'Bob',
                    lastName: 'Smith',
                    email: 'bob.smith@example.com',
                } as any);

                expect(listener).toHaveBeenCalledTimes(1);
                const event = listener.mock.calls[0][0] as UserCreatedEvent;
                expect(event.userId).toBe(created.id);
                expect(event.email).toBe('bob.smith@example.com');
            } finally {
                eventEmitter.off('user.created', listener);
            }
        });

        it('rejects a duplicate email with BadRequestException', async () => {
            await service.create({
                firstName: 'First',
                lastName: 'User',
                email: 'duplicate@example.com',
            } as any);

            await expect(
                service.create({
                    firstName: 'Second',
                    lastName: 'User',
                    email: 'duplicate@example.com',
                } as any),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('honours a supplied fullName instead of rebuilding it', async () => {
            const created = await service.create({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.custom@example.com',
                fullName: 'Custom Full Name',
            } as any);

            expect(created.fullName).toBe('Custom Full Name');
        });
    });

    describe('getById / findByEmail / search', () => {
        it('returns NotFoundException when the user does not exist', async () => {
            await expect(service.getById(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('returns the user without roles when withRoles is not requested', async () => {
            const created = await service.create({
                firstName: 'Carl',
                lastName: 'Brown',
                email: 'carl.brown@example.com',
                roles: [IdentityRole.HR],
            } as any);

            const fetched = await service.getById(created.id!);

            expect(fetched.id).toBe(created.id);
            expect(fetched.roles).toEqual([]);
        });

        it('returns the user with roles when withRoles is requested', async () => {
            const created = await service.create({
                firstName: 'Carl',
                lastName: 'Brown',
                email: 'carl.brown.roles@example.com',
                roles: [IdentityRole.HR, IdentityRole.MANAGER],
            } as any);

            const fetched = await service.getById(created.id!, {
                withRoles: true,
            });

            expect(fetched.roles.sort()).toEqual(
                [IdentityRole.HR, IdentityRole.MANAGER].sort(),
            );
        });

        it('findByEmail returns the user or null', async () => {
            await service.create({
                firstName: 'Diana',
                lastName: 'Green',
                email: 'diana.green@example.com',
            } as any);

            const found = await service.findByEmail('diana.green@example.com');
            expect(found?.email).toBe('diana.green@example.com');

            const missing = await service.findByEmail('nobody@example.com');
            expect(missing).toBeNull();
        });

        it('search filters by status and matches via the search field', async () => {
            await service.create({
                firstName: 'Ed',
                lastName: 'Black',
                email: 'ed.black@example.com',
            } as any);
            await service.create({
                firstName: 'Fred',
                lastName: 'White',
                email: 'fred.white@example.com',
                status: IdentityStatus.INACTIVE,
            } as any);

            const activeOnly = await service.search({
                status: IdentityStatus.ACTIVE,
            } as any);
            expect(activeOnly.map((u) => u.email)).toEqual([
                'ed.black@example.com',
            ]);

            const byPartialName = await service.search({
                search: 'Fred',
            } as any);
            expect(byPartialName.map((u) => u.email)).toEqual([
                'fred.white@example.com',
            ]);
        });
    });

    describe('update', () => {
        it('rebuilds fullName when any name part is patched', async () => {
            const created = await service.create({
                firstName: 'Old',
                lastName: 'Name',
                email: 'update@example.com',
            } as any);

            const updated = await service.update(created.id!, {
                firstName: 'New',
            } as any);

            expect(updated.firstName).toBe('New');
            expect(updated.fullName).toBe('Name New');
        });

        it('preserves fullName when no name field is patched', async () => {
            const created = await service.create({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'update-pos@example.com',
            } as any);

            const updated = await service.update(created.id!, {
                positionId: null,
                teamId: null,
            } as any);

            expect(updated.fullName).toBe('Doe Jane');
        });

        it('throws NotFoundException when updating a missing user', async () => {
            await expect(
                service.update(999999, { firstName: 'X' } as any),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('replaceRoles', () => {
        it('replaces the user role set, removing roles no longer present', async () => {
            const created = await service.create({
                firstName: 'Roles',
                lastName: 'User',
                email: 'roles-user@example.com',
                roles: [IdentityRole.HR, IdentityRole.EMPLOYEE],
            } as any);

            const updated = await service.replaceRoles(created.id!, [
                IdentityRole.MANAGER,
                IdentityRole.EMPLOYEE,
            ]);

            expect(updated.roles.sort()).toEqual(
                [IdentityRole.MANAGER, IdentityRole.EMPLOYEE].sort(),
            );

            const rows = await prisma.userRole.findMany({
                where: { userId: created.id! },
                orderBy: { roleCode: 'asc' },
            });
            expect(rows.map((r) => r.roleCode).sort()).toEqual(
                ['EMPLOYEE', 'MANAGER'].sort(),
            );
        });

        it('clears all roles when given an empty list', async () => {
            const created = await service.create({
                firstName: 'Clear',
                lastName: 'Roles',
                email: 'clear-roles@example.com',
                roles: [IdentityRole.HR],
            } as any);

            const updated = await service.replaceRoles(created.id!, []);

            expect(updated.roles).toEqual([]);
            const rows = await prisma.userRole.findMany({
                where: { userId: created.id! },
            });
            expect(rows).toEqual([]);
        });

        it('deduplicates the requested role list', async () => {
            const created = await service.create({
                firstName: 'Dedupe',
                lastName: 'Roles',
                email: 'dedupe@example.com',
            } as any);

            const updated = await service.replaceRoles(created.id!, [
                IdentityRole.HR,
                IdentityRole.HR,
                IdentityRole.MANAGER,
            ]);

            expect(updated.roles.sort()).toEqual(
                [IdentityRole.HR, IdentityRole.MANAGER].sort(),
            );
        });
    });

    describe('delete', () => {
        it('removes the user row from the database', async () => {
            const created = await service.create({
                firstName: 'Doomed',
                lastName: 'User',
                email: 'doomed@example.com',
            } as any);

            await service.delete(created.id!);

            const fromDb = await prisma.user.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });

        it('throws NotFoundException when deleting a missing user', async () => {
            await expect(service.delete(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('upsertExternalUser', () => {
        it('creates a new EMPLOYEE-role user when none exists for the email', async () => {
            const user = await service.upsertExternalUser({
                email: 'external@example.com',
                firstName: 'Ext',
                lastName: 'User',
                secondName: undefined,
            });

            expect(user.id).toBeDefined();
            expect(user.roles).toEqual([IdentityRole.EMPLOYEE]);
            expect(user.fullName).toBe('User Ext');
        });

        it('returns the existing user when one with the email is already stored', async () => {
            const first = await service.upsertExternalUser({
                email: 'external2@example.com',
                firstName: 'Ext2',
                lastName: 'User',
                secondName: undefined,
            });

            const second = await service.upsertExternalUser({
                email: 'external2@example.com',
                firstName: 'Should',
                lastName: 'BeIgnored',
                secondName: undefined,
            });

            expect(second.id).toBe(first.id);
            expect(second.firstName).toBe('Ext2');

            const rows = await prisma.user.findMany({
                where: { email: 'external2@example.com' },
            });
            expect(rows).toHaveLength(1);
        });
    });

    it('persisted user matches the domain object returned by create', async () => {
        const created = await service.create({
            firstName: 'Round',
            lastName: 'Trip',
            email: 'roundtrip@example.com',
            positionId: null,
            teamId: null,
            managerId: null,
            roles: [IdentityRole.ADMIN],
        } as any);

        const fetched = await service.getById(created.id!, {
            withRoles: true,
        });

        expect(fetched).toBeInstanceOf(UserDomain);
        expect(fetched.id).toBe(created.id);
        expect(fetched.email).toBe(created.email);
        expect(fetched.roles).toEqual([IdentityRole.ADMIN]);
    });
});
