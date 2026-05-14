jest.mock('better-auth', () => ({ betterAuth: jest.fn(() => ({})) }));
jest.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: jest.fn(() => ({})),
}));

import { PositionHierarchyService } from 'src/contexts/organisation/application/services/position-hierarchy.service';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionsController } from 'src/contexts/organisation/presentation/http/controllers/positions.controller';

function buildPosition(id = 1): PositionDomain {
    return PositionDomain.create({
        id,
        title: `Position ${id}`,
        description: 'desc',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    });
}

describe('PositionsController', () => {
    let controller: PositionsController;
    let positions: any;
    let hierarchy: any;

    beforeEach(() => {
        positions = {
            create: jest.fn(),
            search: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            listCompetences: jest.fn(),
        };
        hierarchy = {
            link: jest.fn(),
            unlink: jest.fn(),
            listSubordinates: jest.fn(),
            listSuperiors: jest.fn(),
        };

        controller = new PositionsController(
            positions as unknown as PositionService,
            hierarchy as unknown as PositionHierarchyService,
        );
    });

    describe('create', () => {
        it('forwards the dto to the service and maps the response', async () => {
            positions.create.mockResolvedValue(buildPosition());

            const result = await controller.create({
                title: 'Engineer',
                description: 'desc',
            } as any);

            expect(positions.create).toHaveBeenCalledWith({
                title: 'Engineer',
                description: 'desc',
            });
            expect(result.id).toBe(1);
        });
    });

    describe('search', () => {
        it('maps every position to a response', async () => {
            positions.search.mockResolvedValue([buildPosition()]);
            const result = await controller.search({} as any);
            expect(positions.search).toHaveBeenCalledWith({});
            expect(result).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('parses the id and forwards to the service', async () => {
            positions.getById.mockResolvedValue(buildPosition());
            const result = await controller.getById('1');
            expect(positions.getById).toHaveBeenCalledWith(1);
            expect(result.id).toBe(1);
        });
    });

    describe('update', () => {
        it('parses the id and forwards the dto', async () => {
            positions.update.mockResolvedValue(buildPosition());
            await controller.update('1', { title: 'X' } as any);
            expect(positions.update).toHaveBeenCalledWith(1, { title: 'X' });
        });
    });

    describe('delete', () => {
        it('parses the id and forwards to the service', async () => {
            await controller.delete('1');
            expect(positions.delete).toHaveBeenCalledWith(1);
        });
    });

    describe('linkSubordinate', () => {
        it('links and returns the subordinate position', async () => {
            hierarchy.link.mockResolvedValue(undefined);
            positions.getById.mockResolvedValue(buildPosition(2));

            const result = await controller.linkSubordinate('1', {
                subordinateId: 2,
            } as any);

            expect(hierarchy.link).toHaveBeenCalledWith(1, 2);
            expect(positions.getById).toHaveBeenCalledWith(2);
            expect(result.id).toBe(2);
        });
    });

    describe('unlinkSubordinate', () => {
        it('parses both ids and forwards the call', async () => {
            await controller.unlinkSubordinate('1', '2');
            expect(hierarchy.unlink).toHaveBeenCalledWith(1, 2);
        });
    });

    describe('listSubordinates', () => {
        it('maps every subordinate to a response', async () => {
            hierarchy.listSubordinates.mockResolvedValue([
                buildPosition(2),
                buildPosition(3),
            ]);

            const result = await controller.listSubordinates('1');

            expect(hierarchy.listSubordinates).toHaveBeenCalledWith(1);
            expect(result.map((r) => r.id)).toEqual([2, 3]);
        });
    });

    describe('listSuperiors', () => {
        it('maps every superior to a response', async () => {
            hierarchy.listSuperiors.mockResolvedValue([
                buildPosition(7),
                buildPosition(8),
            ]);

            const result = await controller.listSuperiors('1');

            expect(hierarchy.listSuperiors).toHaveBeenCalledWith(1);
            expect(result.map((r) => r.id)).toEqual([7, 8]);
        });
    });

    describe('listCompetences', () => {
        it('forwards the call and returns the list', async () => {
            positions.listCompetences.mockResolvedValue([7, 8]);
            const result = await controller.listCompetences('1');
            expect(positions.listCompetences).toHaveBeenCalledWith(1);
            expect(result).toEqual([7, 8]);
        });
    });
});
