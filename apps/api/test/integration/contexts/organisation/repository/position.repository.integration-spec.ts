import '../../../setup-env';

import { PositionSortField, SortDirection } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createOrganisationTestModule,
    resetOrganisationTables,
} from '../test-app-organisation';

describe('PositionRepository (integration)', () => {
    let module: TestingModule;
    let repo: PositionRepository;
    let prisma: PrismaService;

    beforeAll(async () => {
        module = await createOrganisationTestModule();
        repo = module.get(PositionRepository);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetOrganisationTables(prisma);
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create', () => {
        it('persists a position to the database', async () => {
            const created = await repo.create(
                PositionDomain.create({
                    title: 'Engineer',
                    description: 'Software engineer',
                }),
            );

            expect(created.id).toBeDefined();
            const fromDb = await prisma.position.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.title).toBe('Engineer');
            expect(fromDb!.description).toBe('Software engineer');
        });
    });

    describe('findById', () => {
        it('returns the position when found', async () => {
            const created = await repo.create(
                PositionDomain.create({ title: 'Engineer' }),
            );

            await expect(repo.findById(created.id!)).resolves.toMatchObject({
                id: created.id,
                title: 'Engineer',
            });
        });

        it('returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });

    describe('search', () => {
        beforeEach(async () => {
            await repo.create(
                PositionDomain.create({
                    title: 'Senior Engineer',
                    description: 'Backend',
                }),
            );
            await repo.create(
                PositionDomain.create({
                    title: 'Junior Engineer',
                    description: 'Backend',
                }),
            );
            await repo.create(
                PositionDomain.create({
                    title: 'Product Manager',
                    description: 'Product',
                }),
            );
        });

        it('returns all positions when no filter is supplied', async () => {
            const all = await repo.search({} as any);
            expect(all).toHaveLength(3);
        });

        it('filters by title (case insensitive substring)', async () => {
            const result = await repo.search({ title: 'engineer' } as any);
            expect(result.map((p) => p.title).sort()).toEqual([
                'Junior Engineer',
                'Senior Engineer',
            ]);
        });

        it('honours descending sort direction on title', async () => {
            const result = await repo.search({
                sortBy: PositionSortField.TITLE,
                sortDirection: SortDirection.DESC,
            } as any);

            const titles = result.map((p) => p.title);
            expect(titles).toEqual([...titles].sort().reverse());
        });
    });

    describe('updateById', () => {
        it('persists the patched fields', async () => {
            const created = await repo.create(
                PositionDomain.create({
                    title: 'Engineer',
                    description: 'old',
                }),
            );

            const updated = await repo.updateById(created.id!, {
                description: 'new',
            });

            expect(updated.description).toBe('new');
            const fromDb = await prisma.position.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.description).toBe('new');
        });
    });

    describe('deleteById', () => {
        it('removes the position row', async () => {
            const created = await repo.create(
                PositionDomain.create({ title: 'Doomed' }),
            );

            await repo.deleteById(created.id!);

            const fromDb = await prisma.position.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });
    });
});
