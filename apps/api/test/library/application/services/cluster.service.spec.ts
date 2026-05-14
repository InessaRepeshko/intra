import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CLUSTER_REPOSITORY } from 'src/contexts/library/application/ports/cluster.repository.port';
import { ClusterService } from 'src/contexts/library/application/services/cluster.service';
import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';

function buildCluster(
    overrides: Partial<Parameters<typeof ClusterDomain.create>[0]> = {},
): ClusterDomain {
    return ClusterDomain.create({
        id: 1,
        competenceId: 7,
        lowerBound: 0,
        upperBound: 5,
        title: 'Top performer',
        description: 'Above 4.5',
        ...overrides,
    });
}

describe('ClusterService', () => {
    let service: ClusterService;
    let clusters: any;
    let competences: any;

    beforeEach(async () => {
        clusters = {
            create: jest.fn(),
            search: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
        };
        competences = { getById: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                ClusterService,
                { provide: CLUSTER_REPOSITORY, useValue: clusters },
                { provide: CompetenceService, useValue: competences },
            ],
        }).compile();

        service = module.get(ClusterService);
    });

    describe('create', () => {
        it('rejects when lowerBound > upperBound', async () => {
            await expect(
                service.create({
                    competenceId: 7,
                    lowerBound: 5,
                    upperBound: 0,
                    title: 'X',
                    description: 'Y',
                }),
            ).rejects.toBeInstanceOf(BadRequestException);
            expect(clusters.create).not.toHaveBeenCalled();
        });

        it('verifies the competence exists before persisting', async () => {
            competences.getById.mockResolvedValue({ id: 7 });
            clusters.create.mockImplementation(
                async (c: ClusterDomain) => c,
            );

            await service.create({
                competenceId: 7,
                lowerBound: 0,
                upperBound: 5,
                title: 'X',
                description: 'Y',
            });

            expect(competences.getById).toHaveBeenCalledWith(7);
            expect(clusters.create).toHaveBeenCalledTimes(1);
            const passed = clusters.create.mock.calls[0][0];
            expect(passed).toBeInstanceOf(ClusterDomain);
            expect(passed.competenceId).toBe(7);
        });
    });

    describe('search', () => {
        it('delegates to the repository', async () => {
            const result = [buildCluster()];
            clusters.search.mockResolvedValue(result);

            const out = await service.search({});
            expect(clusters.search).toHaveBeenCalledWith({});
            expect(out).toBe(result);
        });
    });

    describe('getById', () => {
        it('returns the cluster when found', async () => {
            const cluster = buildCluster();
            clusters.findById.mockResolvedValue(cluster);
            await expect(service.getById(1)).resolves.toBe(cluster);
        });

        it('throws NotFoundException when missing', async () => {
            clusters.findById.mockResolvedValue(null);
            await expect(service.getById(99)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('throws NotFoundException when the cluster does not exist', async () => {
            clusters.findById.mockResolvedValue(null);
            await expect(
                service.update(1, { title: 'X' }),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('verifies a new competence id before updating', async () => {
            clusters.findById.mockResolvedValue(
                buildCluster({ competenceId: 7 }),
            );
            competences.getById.mockResolvedValue({ id: 9 });
            clusters.updateById.mockResolvedValue(buildCluster());

            await service.update(1, { competenceId: 9 });

            expect(competences.getById).toHaveBeenCalledWith(9);
            expect(clusters.updateById).toHaveBeenCalledWith(1, {
                competenceId: 9,
            });
        });

        it('skips competence verification when the id does not change', async () => {
            clusters.findById.mockResolvedValue(
                buildCluster({ competenceId: 7 }),
            );
            clusters.updateById.mockResolvedValue(buildCluster());

            await service.update(1, { competenceId: 7 });

            expect(competences.getById).not.toHaveBeenCalled();
        });

        it('validates merged bounds against current values', async () => {
            clusters.findById.mockResolvedValue(
                buildCluster({ lowerBound: 1, upperBound: 4 }),
            );

            await expect(
                service.update(1, { lowerBound: 5 }),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('forwards only defined patch fields to the repository', async () => {
            clusters.findById.mockResolvedValue(buildCluster());
            clusters.updateById.mockResolvedValue(buildCluster());

            await service.update(1, { title: 'New title' });

            expect(clusters.updateById).toHaveBeenCalledWith(1, {
                title: 'New title',
            });
        });
    });

    describe('delete', () => {
        it('throws when the cluster does not exist', async () => {
            clusters.findById.mockResolvedValue(null);
            await expect(service.delete(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
            expect(clusters.deleteById).not.toHaveBeenCalled();
        });

        it('deletes when found', async () => {
            clusters.findById.mockResolvedValue(buildCluster());
            await service.delete(1);
            expect(clusters.deleteById).toHaveBeenCalledWith(1);
        });
    });
});
