import { IdentityRole, IdentityStatus } from '@intra/shared-kernel';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { UserCreatedEvent } from 'src/contexts/identity/application/events/user-created.event';
import { IDENTITY_ROLE_REPOSITORY } from 'src/contexts/identity/application/ports/role.repository.port';
import { IDENTITY_USER_REPOSITORY } from 'src/contexts/identity/application/ports/user.repository.port';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { RoleDomain } from 'src/contexts/identity/domain/role.domain';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';

function buildUser(
    overrides: Partial<Parameters<typeof UserDomain.create>[0]> = {},
): UserDomain {
    return UserDomain.create({
        id: 1,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        ...overrides,
    });
}

describe('IdentityUserService', () => {
    let service: IdentityUserService;
    let users: any;
    let roles: any;
    let eventEmitter: { emit: jest.Mock };

    beforeEach(async () => {
        users = {
            create: jest.fn(),
            search: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
            replaceRoles: jest.fn(),
        };
        roles = { findByCodes: jest.fn() };
        eventEmitter = { emit: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                IdentityUserService,
                { provide: IDENTITY_USER_REPOSITORY, useValue: users },
                { provide: IDENTITY_ROLE_REPOSITORY, useValue: roles },
                { provide: EventEmitter2, useValue: eventEmitter },
            ],
        }).compile();

        service = module.get(IdentityUserService);
    });

    describe('create', () => {
        it('throws BadRequestException when a user with the email already exists', async () => {
            users.findByEmail.mockResolvedValue(buildUser());

            await expect(
                service.create({
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'jane@example.com',
                } as any),
            ).rejects.toBeInstanceOf(BadRequestException);

            expect(users.create).not.toHaveBeenCalled();
            expect(eventEmitter.emit).not.toHaveBeenCalled();
        });

        it('builds a domain with default status, ids, and roles when not supplied', async () => {
            users.findByEmail.mockResolvedValue(null);
            users.create.mockImplementation(async (u: UserDomain) =>
                UserDomain.create({ ...u, id: 99 }),
            );

            await service.create({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
            } as any);

            const passed = users.create.mock.calls[0][0] as UserDomain;
            expect(passed).toBeInstanceOf(UserDomain);
            expect(passed.status).toBe(IdentityStatus.ACTIVE);
            expect(passed.positionId).toBeNull();
            expect(passed.teamId).toBeNull();
            expect(passed.managerId).toBeNull();
            expect(passed.roles).toEqual([]);
            // The default fullName is "{lastName} {firstName}" via the
            // service's buildFullName, not the domain's "first second last".
            expect(passed.fullName).toBe('Doe Jane');
        });

        it('honours the supplied fullName when present', async () => {
            users.findByEmail.mockResolvedValue(null);
            users.create.mockImplementation(async (u: UserDomain) =>
                UserDomain.create({ ...u, id: 99 }),
            );

            await service.create({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                fullName: 'Custom Full Name',
            } as any);

            const passed = users.create.mock.calls[0][0] as UserDomain;
            expect(passed.fullName).toBe('Custom Full Name');
        });

        it('emits user.created with the persisted id and email', async () => {
            users.findByEmail.mockResolvedValue(null);
            users.create.mockResolvedValue(buildUser({ id: 99 }));

            await service.create({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
            } as any);

            expect(eventEmitter.emit).toHaveBeenCalledWith(
                'user.created',
                expect.any(UserCreatedEvent),
            );
            const event = eventEmitter.emit.mock.calls[0][1] as UserCreatedEvent;
            expect(event.userId).toBe(99);
            expect(event.email).toBe('jane@example.com');
        });

        it('does not emit user.created when the persisted user has no id', async () => {
            users.findByEmail.mockResolvedValue(null);
            users.create.mockResolvedValue(
                UserDomain.create({
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'jane@example.com',
                }),
            );

            await service.create({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
            } as any);

            expect(eventEmitter.emit).not.toHaveBeenCalled();
        });
    });

    describe('search', () => {
        it('delegates to the repository', async () => {
            users.search.mockResolvedValue([buildUser()]);

            const result = await service.search({} as any);
            expect(users.search).toHaveBeenCalledWith({});
            expect(result).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('returns the user when found', async () => {
            const user = buildUser();
            users.findById.mockResolvedValue(user);

            await expect(service.getById(1)).resolves.toBe(user);
            expect(users.findById).toHaveBeenCalledWith(1, undefined);
        });

        it('forwards the withRoles option', async () => {
            users.findById.mockResolvedValue(buildUser());

            await service.getById(1, { withRoles: true });

            expect(users.findById).toHaveBeenCalledWith(1, { withRoles: true });
        });

        it('throws NotFoundException when missing', async () => {
            users.findById.mockResolvedValue(null);

            await expect(service.getById(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('findByEmail', () => {
        it('delegates to the repository with the supplied opts', async () => {
            users.findByEmail.mockResolvedValue(null);

            const result = await service.findByEmail('jane@example.com', {
                withRoles: true,
            });

            expect(users.findByEmail).toHaveBeenCalledWith(
                'jane@example.com',
                { withRoles: true },
            );
            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('throws NotFoundException when the user does not exist', async () => {
            users.findById.mockResolvedValue(null);

            await expect(
                service.update(1, { firstName: 'X' } as any),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('rebuilds fullName when any name part is patched', async () => {
            users.findById.mockResolvedValue(
                buildUser({ firstName: 'Jane', lastName: 'Doe' }),
            );
            users.updateById.mockResolvedValue(buildUser());

            await service.update(1, { firstName: 'Jenny' } as any);

            const passed = users.updateById.mock.calls[0][1];
            expect(passed.firstName).toBe('Jenny');
            expect(passed.fullName).toBe('Doe Jenny');
        });

        it('does not include fullName when no name part is patched', async () => {
            users.findById.mockResolvedValue(buildUser());
            users.updateById.mockResolvedValue(buildUser());

            await service.update(1, { positionId: 7 } as any);

            const passed = users.updateById.mock.calls[0][1];
            expect(passed.positionId).toBe(7);
            expect(passed.fullName).toBeUndefined();
        });
    });

    describe('delete', () => {
        it('throws NotFoundException when the user is missing', async () => {
            users.findById.mockResolvedValue(null);

            await expect(service.delete(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
            expect(users.deleteById).not.toHaveBeenCalled();
        });

        it('deletes when the user exists', async () => {
            users.findById.mockResolvedValue(buildUser());

            await service.delete(1);

            expect(users.deleteById).toHaveBeenCalledWith(1);
        });
    });

    describe('replaceRoles', () => {
        beforeEach(() => {
            users.findById.mockResolvedValue(buildUser());
        });

        it('throws BadRequestException when an unknown role is requested', async () => {
            roles.findByCodes.mockResolvedValue([
                new RoleDomain({ code: IdentityRole.HR, title: 'HR' }),
            ]);

            await expect(
                service.replaceRoles(1, [
                    IdentityRole.HR,
                    IdentityRole.ADMIN,
                ]),
            ).rejects.toBeInstanceOf(BadRequestException);

            expect(users.replaceRoles).not.toHaveBeenCalled();
        });

        it('deduplicates roles and replaces them via the repository', async () => {
            roles.findByCodes.mockResolvedValue([
                new RoleDomain({ code: IdentityRole.HR, title: 'HR' }),
                new RoleDomain({ code: IdentityRole.MANAGER, title: 'Manager' }),
            ]);
            users.replaceRoles.mockResolvedValue(buildUser());

            await service.replaceRoles(1, [
                IdentityRole.HR,
                IdentityRole.HR,
                IdentityRole.MANAGER,
            ]);

            expect(roles.findByCodes).toHaveBeenCalledWith([
                IdentityRole.HR,
                IdentityRole.MANAGER,
            ]);
            expect(users.replaceRoles).toHaveBeenCalledWith(1, [
                IdentityRole.HR,
                IdentityRole.MANAGER,
            ]);
        });
    });

    describe('upsertExternalUser', () => {
        it('returns the existing user when one with the email already exists', async () => {
            const existing = buildUser({ id: 42 });
            users.findByEmail.mockResolvedValue(existing);

            const result = await service.upsertExternalUser({
                email: 'jane@example.com',
                firstName: 'Jane',
                lastName: 'Doe',
                secondName: undefined,
            });

            expect(result).toBe(existing);
            expect(users.create).not.toHaveBeenCalled();
            expect(eventEmitter.emit).not.toHaveBeenCalled();
        });

        it('creates a new EMPLOYEE-role user and emits user.created when missing', async () => {
            users.findByEmail.mockResolvedValue(null);
            users.create.mockImplementation(async (u: UserDomain) =>
                UserDomain.create({ ...u, id: 99 }),
            );

            const result = await service.upsertExternalUser({
                email: 'jane@example.com',
                firstName: 'Jane',
                lastName: 'Doe',
                secondName: 'M.',
                avatarUrl: 'https://example.com/a.png',
            });

            expect(result.id).toBe(99);
            expect(users.create).toHaveBeenCalledTimes(1);
            const passed = users.create.mock.calls[0][0] as UserDomain;
            expect(passed.roles).toEqual([IdentityRole.EMPLOYEE]);
            expect(passed.fullName).toBe('Doe Jane M.');
            expect(eventEmitter.emit).toHaveBeenCalledWith(
                'user.created',
                expect.any(UserCreatedEvent),
            );
        });
    });
});
