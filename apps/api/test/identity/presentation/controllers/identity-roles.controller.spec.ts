jest.mock('better-auth', () => ({ betterAuth: jest.fn(() => ({})) }));
jest.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: jest.fn(() => ({})),
}));

import { IdentityRole } from '@intra/shared-kernel';
import { IdentityRoleService } from 'src/contexts/identity/application/services/identity-role.service';
import { RoleDomain } from 'src/contexts/identity/domain/role.domain';
import { IdentityRolesController } from 'src/contexts/identity/presentation/http/controllers/identity-roles.controller';

describe('IdentityRolesController', () => {
    let controller: IdentityRolesController;
    let service: any;

    beforeEach(() => {
        service = { list: jest.fn() };

        controller = new IdentityRolesController(
            service as unknown as IdentityRoleService,
        );
    });

    describe('list', () => {
        it('maps every role onto a RoleResponse', async () => {
            service.list.mockResolvedValue([
                new RoleDomain({
                    id: 1,
                    code: IdentityRole.HR,
                    title: 'HR',
                    description: 'Human resources',
                }),
                new RoleDomain({
                    id: 2,
                    code: IdentityRole.ADMIN,
                    title: 'Admin',
                    description: null,
                }),
            ]);

            const result = await controller.list();

            expect(service.list).toHaveBeenCalledTimes(1);
            expect(result).toHaveLength(2);
            expect(result[0].code).toBe(IdentityRole.HR);
            expect(result[0].title).toBe('HR');
            expect(result[0].description).toBe('Human resources');
            expect(result[1].code).toBe(IdentityRole.ADMIN);
            expect(result[1].description).toBeNull();
        });
    });
});
