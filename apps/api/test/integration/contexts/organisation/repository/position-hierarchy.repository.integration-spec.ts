import '../../../setup-env';

import { TestingModule } from '@nestjs/testing';
import { PositionHierarchyDomain } from 'src/contexts/organisation/domain/position-hierarchy.domain';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionHierarchyRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position-hierarchy.repository';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createOrganisationTestModule,
    resetOrganisationTables,
} from '../test-app-organisation';

describe('PositionHierarchyRepository (integration)', () => {
    let module: TestingModule;
    let repo: PositionHierarchyRepository;
    let positions: PositionRepository;
    let prisma: PrismaService;

    beforeAll(async () => {
        module = await createOrganisationTestModule();
        repo = module.get(PositionHierarchyRepository);
        positions = module.get(PositionRepository);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetOrganisationTables(prisma);
    });

    afterAll(async () => {
        await module.close();
    });

    async function makePositions() {
        const cto = await positions.create(
            PositionDomain.create({ title: 'CTO' }),
        );
        const lead = await positions.create(
            PositionDomain.create({ title: 'Tech Lead' }),
        );
        return { cto, lead };
    }

    describe('link', () => {
        it('persists a hierarchy relation', async () => {
            const { cto, lead } = await makePositions();

            const created = await repo.link(cto.id!, lead.id!);

            expect(created).toBeInstanceOf(PositionHierarchyDomain);
            expect(created.superiorPositionId).toBe(cto.id);
            expect(created.subordinatePositionId).toBe(lead.id);
        });

        it('is idempotent: returns the existing row on duplicate link', async () => {
            const { cto, lead } = await makePositions();

            const first = await repo.link(cto.id!, lead.id!);
            const second = await repo.link(cto.id!, lead.id!);

            expect(second.id).toBe(first.id);

            const rows = await prisma.positionHierarchy.findMany({
                where: {
                    superiorPositionId: cto.id!,
                    subordinatePositionId: lead.id!,
                },
            });
            expect(rows).toHaveLength(1);
        });
    });

    describe('unlink', () => {
        it('removes the relation when it exists', async () => {
            const { cto, lead } = await makePositions();
            await repo.link(cto.id!, lead.id!);

            await repo.unlink(cto.id!, lead.id!);

            const rows = await prisma.positionHierarchy.findMany({
                where: {
                    superiorPositionId: cto.id!,
                    subordinatePositionId: lead.id!,
                },
            });
            expect(rows).toEqual([]);
        });

        it('does not throw when the relation is absent', async () => {
            const { cto, lead } = await makePositions();
            await expect(
                repo.unlink(cto.id!, lead.id!),
            ).resolves.toBeUndefined();
        });
    });

    describe('listSubordinates / listSuperiors', () => {
        it('listSubordinates returns relations where the position is superior', async () => {
            const { cto, lead } = await makePositions();
            await repo.link(cto.id!, lead.id!);

            const result = await repo.listSubordinates(cto.id!);

            expect(result).toHaveLength(1);
            expect(result[0].subordinatePositionId).toBe(lead.id);
        });

        it('listSuperiors returns relations where the position is subordinate', async () => {
            const { cto, lead } = await makePositions();
            await repo.link(cto.id!, lead.id!);

            const result = await repo.listSuperiors(lead.id!);

            expect(result).toHaveLength(1);
            expect(result[0].superiorPositionId).toBe(cto.id);
        });

        it('returns an empty array when no relations exist', async () => {
            const { cto } = await makePositions();
            await expect(repo.listSubordinates(cto.id!)).resolves.toEqual([]);
            await expect(repo.listSuperiors(cto.id!)).resolves.toEqual([]);
        });
    });
});
