import '../../../setup-env';

import { ClusterSortField, SortDirection } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { ClusterRepository } from 'src/contexts/library/infrastructure/prisma-repositories/cluster.repository';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createLibraryTestModule,
    resetLibraryTables,
} from '../test-app-library';

describe('ClusterRepository (integration)', () => {
    let module: TestingModule;
    let repo: ClusterRepository;
    let competences: CompetenceRepository;
    let prisma: PrismaService;
    let competenceId: number;

    beforeAll(async () => {
        module = await createLibraryTestModule();
        repo = module.get(ClusterRepository);
        competences = module.get(CompetenceRepository);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetLibraryTables(prisma);
        const competence = await competences.create(
            CompetenceDomain.create({ title: 'Teamwork' }),
        );
        competenceId = competence.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create', () => {
        it('persists a cluster row', async () => {
            const created = await repo.create(
                ClusterDomain.create({
                    competenceId,
                    lowerBound: 0,
                    upperBound: 2,
                    title: 'Beginner',
                    description: 'desc',
                }),
            );

            expect(created.id).toBeDefined();
            expect(created.competenceId).toBe(competenceId);

            const fromDb = await prisma.cluster.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.title).toBe('Beginner');
        });
    });

    describe('findById', () => {
        it('returns the cluster when found', async () => {
            const created = await repo.create(
                ClusterDomain.create({
                    competenceId,
                    lowerBound: 0,
                    upperBound: 1,
                    title: 'B',
                    description: '',
                }),
            );

            await expect(repo.findById(created.id!)).resolves.toBeInstanceOf(
                ClusterDomain,
            );
        });

        it('returns null when missing', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });

    describe('search', () => {
        beforeEach(async () => {
            await repo.create(
                ClusterDomain.create({
                    competenceId,
                    lowerBound: 0,
                    upperBound: 2,
                    title: 'Alpha',
                    description: 'a',
                }),
            );
            await repo.create(
                ClusterDomain.create({
                    competenceId,
                    lowerBound: 3,
                    upperBound: 5,
                    title: 'Beta',
                    description: 'b',
                }),
            );
        });

        it('returns all when no filter is supplied', async () => {
            const all = await repo.search({} as any);
            expect(all).toHaveLength(2);
        });

        it('filters by competenceId', async () => {
            const result = await repo.search({ competenceId } as any);
            expect(result).toHaveLength(2);
        });

        it('honours descending sort on title', async () => {
            const result = await repo.search({
                sortBy: ClusterSortField.TITLE,
                sortDirection: SortDirection.DESC,
            } as any);
            const titles = result.map((c) => c.title);
            expect(titles).toEqual([...titles].sort().reverse());
        });
    });

    describe('updateById', () => {
        it('persists the patched fields', async () => {
            const created = await repo.create(
                ClusterDomain.create({
                    competenceId,
                    lowerBound: 0,
                    upperBound: 2,
                    title: 'B',
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
        it('removes the cluster row', async () => {
            const created = await repo.create(
                ClusterDomain.create({
                    competenceId,
                    lowerBound: 0,
                    upperBound: 1,
                    title: 'B',
                    description: '',
                }),
            );

            await repo.deleteById(created.id!);

            const fromDb = await prisma.cluster.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });
    });
});
