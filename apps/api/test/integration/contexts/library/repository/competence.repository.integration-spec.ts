import '../../../setup-env';

import { CompetenceSortField, SortDirection } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createLibraryTestModule,
    resetLibraryTables,
} from '../test-app-library';

describe('CompetenceRepository (integration)', () => {
    let module: TestingModule;
    let repo: CompetenceRepository;
    let prisma: PrismaService;

    beforeAll(async () => {
        module = await createLibraryTestModule();
        repo = module.get(CompetenceRepository);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetLibraryTables(prisma);
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create', () => {
        it('persists a competence and round-trips through Prisma', async () => {
            const created = await repo.create(
                CompetenceDomain.create({
                    code: 'C-1',
                    title: 'Teamwork',
                    description: 'Working in a team',
                }),
            );

            expect(created.id).toBeDefined();
            expect(created.code).toBe('C-1');

            const fromDb = await prisma.competence.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.title).toBe('Teamwork');
        });
    });

    describe('findById', () => {
        it('returns the competence when found', async () => {
            const created = await repo.create(
                CompetenceDomain.create({ title: 'A' }),
            );

            await expect(repo.findById(created.id!)).resolves.toBeInstanceOf(
                CompetenceDomain,
            );
        });

        it('returns null when missing', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });

    describe('search', () => {
        beforeEach(async () => {
            await repo.create(
                CompetenceDomain.create({
                    code: 'C-A',
                    title: 'Alpha',
                    description: 'first',
                }),
            );
            await repo.create(
                CompetenceDomain.create({
                    code: 'C-B',
                    title: 'Beta',
                    description: 'second',
                }),
            );
            await repo.create(
                CompetenceDomain.create({
                    code: 'C-C',
                    title: 'Gamma',
                    description: 'third',
                }),
            );
        });

        it('returns all when no filter is supplied', async () => {
            const all = await repo.search({} as any);
            expect(all).toHaveLength(3);
        });

        it('filters by code (case insensitive substring)', async () => {
            const result = await repo.search({ code: 'c-a' } as any);
            expect(result.map((c) => c.code)).toEqual(['C-A']);
        });

        it('honours descending sort on title', async () => {
            const result = await repo.search({
                sortBy: CompetenceSortField.TITLE,
                sortDirection: SortDirection.DESC,
            } as any);

            const titles = result.map((c) => c.title);
            expect(titles).toEqual([...titles].sort().reverse());
        });
    });

    describe('updateById', () => {
        it('persists the patched fields', async () => {
            const created = await repo.create(
                CompetenceDomain.create({
                    title: 'Old',
                    description: 'old',
                }),
            );

            const updated = await repo.updateById(created.id!, {
                description: 'new',
            } as any);

            expect(updated.description).toBe('new');
        });
    });

    describe('deleteById', () => {
        it('removes the competence row', async () => {
            const created = await repo.create(
                CompetenceDomain.create({ title: 'Doomed' }),
            );

            await repo.deleteById(created.id!);

            const fromDb = await prisma.competence.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });
    });
});
