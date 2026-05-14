import '../../../setup-env';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PrismaService } from 'src/database/prisma.service';
import {
    createOrganisationTestModule,
    resetOrganisationTables,
} from '../test-app-organisation';

describe('PositionService (integration)', () => {
    let module: TestingModule;
    let service: PositionService;
    let prisma: PrismaService;

    beforeAll(async () => {
        module = await createOrganisationTestModule();
        service = module.get(PositionService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetOrganisationTables(prisma);
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create', () => {
        it('persists a new position with the supplied attributes', async () => {
            const created = await service.create({
                title: 'Engineer',
                description: 'Software engineer',
            });

            expect(created.id).toBeDefined();
            expect(created.title).toBe('Engineer');
            expect(created.description).toBe('Software engineer');

            const fromDb = await prisma.position.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).not.toBeNull();
            expect(fromDb!.title).toBe('Engineer');
        });

        it('coerces a missing description to null in the database', async () => {
            const created = await service.create({ title: 'Manager' });

            const fromDb = await prisma.position.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.description).toBeNull();
        });
    });

    describe('search', () => {
        beforeEach(async () => {
            await service.create({ title: 'Senior Engineer' });
            await service.create({ title: 'Junior Engineer' });
            await service.create({ title: 'Product Manager' });
        });

        it('returns all positions when no filter is supplied', async () => {
            const all = await service.search({} as any);
            expect(all).toHaveLength(3);
        });

        it('filters by title (case insensitive substring)', async () => {
            const result = await service.search({ title: 'ENGINEER' } as any);
            expect(result.map((p) => p.title).sort()).toEqual([
                'Junior Engineer',
                'Senior Engineer',
            ]);
        });
    });

    describe('getById', () => {
        it('returns the position when found', async () => {
            const created = await service.create({ title: 'Engineer' });

            await expect(service.getById(created.id!)).resolves.toMatchObject({
                id: created.id,
                title: 'Engineer',
            });
        });

        it('throws NotFoundException when missing', async () => {
            await expect(service.getById(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('forwards the patch and persists the changes', async () => {
            const created = await service.create({ title: 'Engineer' });

            const updated = await service.update(created.id!, {
                description: 'Updated description',
            });

            expect(updated.description).toBe('Updated description');

            const fromDb = await prisma.position.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.description).toBe('Updated description');
        });

        it('throws NotFoundException when the position does not exist', async () => {
            await expect(
                service.update(999999, { title: 'X' }),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('delete', () => {
        it('removes the position when nothing is linked', async () => {
            const created = await service.create({ title: 'Doomed' });

            await service.delete(created.id!);

            const fromDb = await prisma.position.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });

        it('rejects deletion when the position has competence relations', async () => {
            const created = await service.create({ title: 'Linked' });

            // Insert a library_position_competence_relations row directly.
            // We don't have a Competence yet, so insert one too.
            const competence = await prisma.competence.create({
                data: { title: 'Teamwork' },
            });
            await prisma.positionCompetenceRelation.create({
                data: {
                    positionId: created.id!,
                    competenceId: competence.id,
                },
            });

            await expect(service.delete(created.id!)).rejects.toBeInstanceOf(
                BadRequestException,
            );

            // Position must still be in DB
            const stillThere = await prisma.position.findUnique({
                where: { id: created.id! },
            });
            expect(stillThere).not.toBeNull();
        });

        it('throws NotFoundException when deleting a missing position', async () => {
            await expect(service.delete(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('listCompetences', () => {
        it('returns competence ids linked to the position', async () => {
            const position = await service.create({ title: 'Engineer' });
            const c1 = await prisma.competence.create({
                data: { title: 'Teamwork' },
            });
            const c2 = await prisma.competence.create({
                data: { title: 'Leadership' },
            });
            await prisma.positionCompetenceRelation.createMany({
                data: [
                    { positionId: position.id!, competenceId: c1.id },
                    { positionId: position.id!, competenceId: c2.id },
                ],
            });

            const result = await service.listCompetences(position.id!);

            expect(result.sort()).toEqual([c1.id, c2.id].sort());
        });

        it('returns an empty array when the position has no competences', async () => {
            const position = await service.create({ title: 'Engineer' });
            await expect(
                service.listCompetences(position.id!),
            ).resolves.toEqual([]);
        });
    });

    it('round-trips a domain through the database', async () => {
        const created = await service.create({
            title: 'Round Trip',
            description: 'desc',
        });
        const fetched = await service.getById(created.id!);

        expect(fetched).toBeInstanceOf(PositionDomain);
        expect(fetched.id).toBe(created.id);
        expect(fetched.title).toBe('Round Trip');
        expect(fetched.description).toBe('desc');
    });
});
