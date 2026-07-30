import '../../../setup-env';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { PositionHierarchyService } from 'src/contexts/organisation/application/services/position-hierarchy.service';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PrismaService } from 'src/database/prisma.service';
import {
    createOrganisationTestModule,
    resetOrganisationTables,
} from '../test-app-organisation';

describe('PositionHierarchyService (integration)', () => {
    let module: TestingModule;
    let service: PositionHierarchyService;
    let positions: PositionService;
    let prisma: PrismaService;

    let cto: PositionDomain;
    let lead: PositionDomain;
    let engineer: PositionDomain;

    beforeAll(async () => {
        module = await createOrganisationTestModule();
        service = module.get(PositionHierarchyService);
        positions = module.get(PositionService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetOrganisationTables(prisma);
        cto = await positions.create({ title: 'CTO' });
        lead = await positions.create({ title: 'Tech Lead' });
        engineer = await positions.create({ title: 'Engineer' });
    });

    afterAll(async () => {
        await module.close();
    });

    describe('link', () => {
        it('persists a superior → subordinate relation', async () => {
            await service.link(cto.id!, lead.id!);

            const rows = await prisma.positionHierarchy.findMany({
                where: {
                    superiorPositionId: cto.id!,
                    subordinatePositionId: lead.id!,
                },
            });
            expect(rows).toHaveLength(1);
        });

        it('rejects self-linking', async () => {
            await expect(service.link(cto.id!, cto.id!)).rejects.toBeInstanceOf(
                BadRequestException,
            );

            const rows = await prisma.positionHierarchy.findMany({
                where: { superiorPositionId: cto.id! },
            });
            expect(rows).toEqual([]);
        });

        it('throws NotFoundException when either position is missing', async () => {
            await expect(service.link(999999, lead.id!)).rejects.toBeInstanceOf(
                NotFoundException,
            );
            await expect(service.link(cto.id!, 999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('is idempotent for duplicate links', async () => {
            const first = await service.link(cto.id!, lead.id!);
            const second = await service.link(cto.id!, lead.id!);

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
        it('removes an existing link', async () => {
            await service.link(cto.id!, lead.id!);

            await service.unlink(cto.id!, lead.id!);

            const rows = await prisma.positionHierarchy.findMany({
                where: {
                    superiorPositionId: cto.id!,
                    subordinatePositionId: lead.id!,
                },
            });
            expect(rows).toEqual([]);
        });

        it('does nothing when the link did not exist (no error)', async () => {
            await expect(
                service.unlink(cto.id!, lead.id!),
            ).resolves.toBeUndefined();
        });
    });

    describe('listSubordinates', () => {
        it('returns every subordinate position of the given superior', async () => {
            await service.link(cto.id!, lead.id!);
            await service.link(cto.id!, engineer.id!);

            const result = await service.listSubordinates(cto.id!);

            expect(result.map((p) => p.id).sort()).toEqual(
                [lead.id, engineer.id].sort(),
            );
            result.forEach((p) => expect(p).toBeInstanceOf(PositionDomain));
        });

        it('returns an empty array when there are no subordinates', async () => {
            await expect(service.listSubordinates(cto.id!)).resolves.toEqual(
                [],
            );
        });
    });

    describe('listSuperiors', () => {
        it('returns every superior of the given subordinate', async () => {
            await service.link(cto.id!, engineer.id!);
            await service.link(lead.id!, engineer.id!);

            const result = await service.listSuperiors(engineer.id!);

            expect(result.map((p) => p.id).sort()).toEqual(
                [cto.id, lead.id].sort(),
            );
        });

        it('returns an empty array when there are no superiors', async () => {
            await expect(service.listSuperiors(engineer.id!)).resolves.toEqual(
                [],
            );
        });
    });
});
