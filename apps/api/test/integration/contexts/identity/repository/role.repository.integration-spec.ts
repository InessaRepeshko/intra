import '../../../setup-env';

import { IdentityRole } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { RoleDomain } from 'src/contexts/identity/domain/role.domain';
import { RoleRepository } from 'src/contexts/identity/infrastructure/prisma-repositories/role.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createIdentityTestModule,
    ensureRolesSeeded,
} from '../test-app-identity';

describe('RoleRepository (integration)', () => {
    let module: TestingModule;
    let repo: RoleRepository;
    let prisma: PrismaService;

    beforeAll(async () => {
        module = await createIdentityTestModule();
        repo = module.get(RoleRepository);
        prisma = module.get(PrismaService);
        await ensureRolesSeeded(prisma);
    });

    afterAll(async () => {
        await module.close();
    });

    describe('getAll', () => {
        it('returns all four seeded identity roles', async () => {
            const roles = await repo.getAll();

            expect(roles.map((r) => r.code).sort()).toEqual(
                [
                    IdentityRole.ADMIN,
                    IdentityRole.EMPLOYEE,
                    IdentityRole.HR,
                    IdentityRole.MANAGER,
                ].sort(),
            );
            roles.forEach((r) => expect(r).toBeInstanceOf(RoleDomain));
        });

        it('returns roles in a stable order across calls', async () => {
            // Prisma sorts enum columns in the order their values are
            // declared in the schema (ADMIN → HR → MANAGER → EMPLOYEE),
            // not lexicographically. We just assert determinism.
            const first = (await repo.getAll()).map((r) => r.code);
            const second = (await repo.getAll()).map((r) => r.code);
            expect(second).toEqual(first);
        });
    });

    describe('findByCodes', () => {
        it('returns the roles matching the requested codes', async () => {
            const roles = await repo.findByCodes([
                IdentityRole.ADMIN,
                IdentityRole.HR,
            ]);

            expect(roles).toHaveLength(2);
            expect(roles.map((r) => r.code).sort()).toEqual(
                [IdentityRole.ADMIN, IdentityRole.HR].sort(),
            );
        });

        it('returns an empty array for an empty codes input', async () => {
            await expect(repo.findByCodes([])).resolves.toEqual([]);
        });

        it('returns only roles that actually exist when subset is requested', async () => {
            const roles = await repo.findByCodes([IdentityRole.MANAGER]);

            expect(roles).toHaveLength(1);
            expect(roles[0].code).toBe(IdentityRole.MANAGER);
        });
    });
});
