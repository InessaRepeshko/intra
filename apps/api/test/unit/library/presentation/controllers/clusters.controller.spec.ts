jest.mock('better-auth', () => ({ betterAuth: jest.fn(() => ({})) }));
jest.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: jest.fn(() => ({})),
}));

import { ClusterService } from 'src/contexts/library/application/services/cluster.service';
import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';
import { ClustersController } from 'src/contexts/library/presentation/http/controllers/clusters.controller';

function buildCluster(): ClusterDomain {
    return ClusterDomain.create({
        id: 1,
        competenceId: 7,
        lowerBound: 0,
        upperBound: 5,
        title: 'Top performer',
        description: 'Above 4.5',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    });
}

describe('ClustersController', () => {
    let controller: ClustersController;
    let service: any;

    beforeEach(() => {
        service = {
            create: jest.fn(),
            search: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        controller = new ClustersController(
            service as unknown as ClusterService,
        );
    });

    describe('create', () => {
        it('forwards the dto and maps the response', async () => {
            service.create.mockResolvedValue(buildCluster());

            const result = await controller.create({
                competenceId: 7,
                lowerBound: 0,
                upperBound: 5,
                title: 'Top performer',
                description: 'Above 4.5',
            } as any);

            expect(service.create).toHaveBeenCalledWith({
                competenceId: 7,
                lowerBound: 0,
                upperBound: 5,
                title: 'Top performer',
                description: 'Above 4.5',
            });
            expect(result.id).toBe(1);
            expect(result.title).toBe('Top performer');
        });
    });

    describe('search', () => {
        it('maps every cluster to a response', async () => {
            service.search.mockResolvedValue([buildCluster()]);
            const result = await controller.search({} as any);

            expect(service.search).toHaveBeenCalledWith({});
            expect(result).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('parses the id and forwards to the service', async () => {
            service.getById.mockResolvedValue(buildCluster());

            const result = await controller.getById('1');

            expect(service.getById).toHaveBeenCalledWith(1);
            expect(result.id).toBe(1);
        });
    });

    describe('update', () => {
        it('parses the id and forwards the dto', async () => {
            service.update.mockResolvedValue(buildCluster());

            const result = await controller.update('1', { title: 'X' } as any);

            expect(service.update).toHaveBeenCalledWith(1, { title: 'X' });
            expect(result.title).toBe('Top performer');
        });
    });

    describe('delete', () => {
        it('parses the id and forwards to the service', async () => {
            await controller.delete('1');
            expect(service.delete).toHaveBeenCalledWith(1);
        });
    });
});
