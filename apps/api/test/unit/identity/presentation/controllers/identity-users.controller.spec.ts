jest.mock('better-auth', () => ({ betterAuth: jest.fn(() => ({})) }));
jest.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: jest.fn(() => ({})),
}));

import { IdentityRole, IdentityStatus } from '@intra/shared-kernel';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { IdentityUsersController } from 'src/contexts/identity/presentation/http/controllers/identity-users.controller';

function buildUser(): UserDomain {
    return UserDomain.create({
        id: 1,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        status: IdentityStatus.ACTIVE,
        roles: [IdentityRole.HR],
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    });
}

describe('IdentityUsersController', () => {
    let controller: IdentityUsersController;
    let service: any;

    beforeEach(() => {
        service = {
            create: jest.fn(),
            search: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            replaceRoles: jest.fn(),
            delete: jest.fn(),
        };

        controller = new IdentityUsersController(
            service as unknown as IdentityUserService,
        );
    });

    describe('create', () => {
        it('forwards the dto to the service and maps the response', async () => {
            service.create.mockResolvedValue(buildUser());

            const result = await controller.create({
                firstName: 'Jane',
                secondName: 'M.',
                lastName: 'Doe',
                fullName: 'Jane M. Doe',
                email: 'jane@example.com',
                status: IdentityStatus.ACTIVE,
                positionId: 3,
                teamId: 4,
                managerId: 5,
                roles: [IdentityRole.HR],
            } as any);

            expect(service.create).toHaveBeenCalledWith({
                firstName: 'Jane',
                secondName: 'M.',
                lastName: 'Doe',
                fullName: 'Jane M. Doe',
                email: 'jane@example.com',
                status: IdentityStatus.ACTIVE,
                positionId: 3,
                teamId: 4,
                managerId: 5,
                roles: [IdentityRole.HR],
            });
            expect(result.id).toBe(1);
        });
    });

    describe('search', () => {
        it('maps every user to a response', async () => {
            service.search.mockResolvedValue([buildUser()]);

            const result = await controller.search({} as any);

            expect(service.search).toHaveBeenCalledWith({});
            expect(result).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('parses the id and requests roles inclusion', async () => {
            service.getById.mockResolvedValue(buildUser());

            const result = await controller.getById('1');

            expect(service.getById).toHaveBeenCalledWith(1, {
                withRoles: true,
            });
            expect(result.id).toBe(1);
        });
    });

    describe('update', () => {
        it('parses the id and forwards the patch', async () => {
            service.update.mockResolvedValue(buildUser());

            await controller.update('1', {
                firstName: 'Jenny',
                lastName: 'Doe',
                status: IdentityStatus.INACTIVE,
                positionId: 3,
                teamId: 4,
                managerId: 5,
            } as any);

            expect(service.update).toHaveBeenCalledWith(1, {
                firstName: 'Jenny',
                secondName: undefined,
                lastName: 'Doe',
                status: IdentityStatus.INACTIVE,
                positionId: 3,
                teamId: 4,
                managerId: 5,
            });
        });
    });

    describe('replaceRoles', () => {
        it('parses the id and forwards the roles list', async () => {
            service.replaceRoles.mockResolvedValue(buildUser());

            const result = await controller.replaceRoles('1', {
                roles: [IdentityRole.HR, IdentityRole.MANAGER],
            } as any);

            expect(service.replaceRoles).toHaveBeenCalledWith(1, [
                IdentityRole.HR,
                IdentityRole.MANAGER,
            ]);
            expect(result.id).toBe(1);
        });
    });

    describe('delete', () => {
        it('parses the id and calls service.delete', async () => {
            await controller.delete('1');
            expect(service.delete).toHaveBeenCalledWith(1);
        });
    });
});
