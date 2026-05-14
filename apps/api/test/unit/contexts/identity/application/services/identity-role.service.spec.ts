import { IdentityRole } from '@intra/shared-kernel';
import { Test } from '@nestjs/testing';
import { IDENTITY_ROLE_REPOSITORY } from 'src/contexts/identity/application/ports/role.repository.port';
import { IdentityRoleService } from 'src/contexts/identity/application/services/identity-role.service';
import { RoleDomain } from 'src/contexts/identity/domain/role.domain';

function buildRole(code: IdentityRole): RoleDomain {
    return new RoleDomain({
        id: 1,
        code,
        title: code,
        description: null,
    });
}

describe('IdentityRoleService', () => {
    let service: IdentityRoleService;
    let roles: any;

    beforeEach(async () => {
        roles = { getAll: jest.fn(), findByCodes: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                IdentityRoleService,
                { provide: IDENTITY_ROLE_REPOSITORY, useValue: roles },
            ],
        }).compile();

        service = module.get(IdentityRoleService);
    });

    describe('list', () => {
        it('delegates to the repository getAll', async () => {
            const items = [
                buildRole(IdentityRole.ADMIN),
                buildRole(IdentityRole.HR),
            ];
            roles.getAll.mockResolvedValue(items);

            await expect(service.list()).resolves.toBe(items);
            expect(roles.getAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getByCodes', () => {
        it('delegates to the repository findByCodes', async () => {
            const items = [buildRole(IdentityRole.MANAGER)];
            roles.findByCodes.mockResolvedValue(items);

            const result = await service.getByCodes([IdentityRole.MANAGER]);

            expect(roles.findByCodes).toHaveBeenCalledWith([
                IdentityRole.MANAGER,
            ]);
            expect(result).toBe(items);
        });
    });
});
