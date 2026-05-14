import '../../../setup-env';

import { IdentityRole } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { IdentityRoleService } from 'src/contexts/identity/application/services/identity-role.service';
import { RoleDomain } from 'src/contexts/identity/domain/role.domain';
import { PrismaService } from 'src/database/prisma.service';
import {
    createIdentityTestModule,
    ensureRolesSeeded,
} from '../test-app-identity';

describe('IdentityRoleService (integration)', () => {
    let module: TestingModule;
    let service: IdentityRoleService;
    let prisma: PrismaService;

    beforeAll(async () => {
        module = await createIdentityTestModule();
        service = module.get(IdentityRoleService);
        prisma = module.get(PrismaService);
        await ensureRolesSeeded(prisma);
    });

    afterAll(async () => {
        await module.close();
    });

    describe('list', () => {
        it('returns every seeded identity role from the database', async () => {
            const roles = await service.list();

            const codes = roles.map((r) => r.code).sort();
            expect(codes).toEqual(
                [
                    IdentityRole.ADMIN,
                    IdentityRole.EMPLOYEE,
                    IdentityRole.HR,
                    IdentityRole.MANAGER,
                ].sort(),
            );
            roles.forEach((r) => {
                expect(r).toBeInstanceOf(RoleDomain);
                expect(r.id).toBeDefined();
                expect(r.title).toBeTruthy();
            });
        });

        it('returns roles in a deterministic order across calls', async () => {
            // Prisma sorts enum columns in the order values are declared
            // in the schema, not lexicographically. We just assert the
            // order is stable rather than asserting a specific sort.
            const first = (await service.list()).map((r) => r.code);
            const second = (await service.list()).map((r) => r.code);
            expect(second).toEqual(first);
        });
    });

    describe('getByCodes', () => {
        it('returns only the roles whose codes are requested', async () => {
            const roles = await service.getByCodes([
                IdentityRole.HR,
                IdentityRole.MANAGER,
            ]);

            expect(roles).toHaveLength(2);
            expect(roles.map((r) => r.code).sort()).toEqual(
                [IdentityRole.HR, IdentityRole.MANAGER].sort(),
            );
        });

        it('returns an empty array for an empty codes input', async () => {
            await expect(service.getByCodes([])).resolves.toEqual([]);
        });

        it('returns whatever subset of requested codes actually exists', async () => {
            const roles = await service.getByCodes([IdentityRole.ADMIN]);

            expect(roles).toHaveLength(1);
            expect(roles[0].code).toBe(IdentityRole.ADMIN);
        });
    });
});
