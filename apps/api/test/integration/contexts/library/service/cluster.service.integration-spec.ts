import '../../../setup-env';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ClusterService } from 'src/contexts/library/application/services/cluster.service';
import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';
import { PrismaService } from 'src/database/prisma.service';
import {
    createLibraryTestModule,
    resetLibraryTables,
} from '../test-app-library';

describe('ClusterService (integration)', () => {
    let module: TestingModule;
    let service: ClusterService;
    let competences: CompetenceService;
    let prisma: PrismaService;
    let competenceId: number;

    beforeAll(async () => {
        module = await createLibraryTestModule();
        service = module.get(ClusterService);
        competences = module.get(CompetenceService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetLibraryTables(prisma);
        const competence = await competences.create({
            title: 'Teamwork',
        } as any);
        competenceId = competence.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create', () => {
        it('persists a cluster bound to the competence', async () => {
            const created = await service.create({
                competenceId,
                lowerBound: 0,
                upperBound: 2,
                title: 'Beginner',
                description: 'Just starting out',
            });

            expect(created.id).toBeDefined();
            expect(created.competenceId).toBe(competenceId);
            expect(created.lowerBound).toBe(0);
            expect(created.upperBound).toBe(2);

            const fromDb = await prisma.cluster.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.title).toBe('Beginner');
        });

        it('rejects creation when lowerBound > upperBound', async () => {
            await expect(
                service.create({
                    competenceId,
                    lowerBound: 5,
                    upperBound: 2,
                    title: 'Invalid',
                    description: '',
                }),
            ).rejects.toBeInstanceOf(BadRequestException);

            const rows = await prisma.cluster.findMany();
            expect(rows).toHaveLength(0);
        });

        it('throws NotFoundException when the competence is missing', async () => {
            await expect(
                service.create({
                    competenceId: 999999,
                    lowerBound: 0,
                    upperBound: 1,
                    title: 'Orphan',
                    description: '',
                }),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('search', () => {
        beforeEach(async () => {
            await service.create({
                competenceId,
                lowerBound: 0,
                upperBound: 2,
                title: 'Beginner',
                description: 'a',
            });
            await service.create({
                competenceId,
                lowerBound: 3,
                upperBound: 5,
                title: 'Intermediate',
                description: 'b',
            });
        });

        it('returns all clusters when no filter is supplied', async () => {
            const all = await service.search({} as any);
            expect(all).toHaveLength(2);
        });

        it('filters by title (case insensitive substring)', async () => {
            const result = await service.search({
                title: 'beginner',
            } as any);
            expect(result.map((c) => c.title)).toEqual(['Beginner']);
        });
    });

    describe('getById', () => {
        it('returns the cluster when found', async () => {
            const created = await service.create({
                competenceId,
                lowerBound: 0,
                upperBound: 1,
                title: 'B',
                description: '',
            });

            await expect(service.getById(created.id!)).resolves.toBeInstanceOf(
                ClusterDomain,
            );
        });

        it('throws NotFoundException for a missing id', async () => {
            await expect(service.getById(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('persists patched fields', async () => {
            const created = await service.create({
                competenceId,
                lowerBound: 0,
                upperBound: 2,
                title: 'B',
                description: 'old',
            });

            const updated = await service.update(created.id!, {
                description: 'new',
            } as any);

            expect(updated.description).toBe('new');
        });

        it('rejects when patched bounds are inverted', async () => {
            const created = await service.create({
                competenceId,
                lowerBound: 0,
                upperBound: 2,
                title: 'B',
                description: '',
            });

            await expect(
                service.update(created.id!, {
                    lowerBound: 10,
                    upperBound: 1,
                } as any),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('validates the new competenceId exists when changed', async () => {
            const created = await service.create({
                competenceId,
                lowerBound: 0,
                upperBound: 2,
                title: 'B',
                description: '',
            });

            await expect(
                service.update(created.id!, {
                    competenceId: 999999,
                } as any),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('delete', () => {
        it('removes the cluster row', async () => {
            const created = await service.create({
                competenceId,
                lowerBound: 0,
                upperBound: 1,
                title: 'B',
                description: '',
            });

            await service.delete(created.id!);

            const fromDb = await prisma.cluster.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });

        it('throws NotFoundException for a missing cluster', async () => {
            await expect(service.delete(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });
});
