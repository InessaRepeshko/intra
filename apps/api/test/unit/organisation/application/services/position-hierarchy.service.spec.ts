import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ORGANISATION_POSITION_HIERARCHY_REPOSITORY } from 'src/contexts/organisation/application/ports/position-hierarchy.repository.port';
import { PositionHierarchyService } from 'src/contexts/organisation/application/services/position-hierarchy.service';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { PositionHierarchyDomain } from 'src/contexts/organisation/domain/position-hierarchy.domain';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';

function buildPosition(id: number): PositionDomain {
    return PositionDomain.create({ id, title: `Position ${id}` });
}

describe('PositionHierarchyService', () => {
    let service: PositionHierarchyService;
    let hierarchy: any;
    let positions: any;

    beforeEach(async () => {
        hierarchy = {
            link: jest.fn(),
            unlink: jest.fn(),
            listSubordinates: jest.fn(),
            listSuperiors: jest.fn(),
        };
        positions = { getById: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                PositionHierarchyService,
                {
                    provide: ORGANISATION_POSITION_HIERARCHY_REPOSITORY,
                    useValue: hierarchy,
                },
                { provide: PositionService, useValue: positions },
            ],
        }).compile();

        service = module.get(PositionHierarchyService);
    });

    describe('link', () => {
        it('rejects when superior and subordinate are the same position', async () => {
            await expect(service.link(1, 1)).rejects.toBeInstanceOf(
                BadRequestException,
            );
            expect(hierarchy.link).not.toHaveBeenCalled();
        });

        it('verifies both positions and links the relation', async () => {
            positions.getById.mockResolvedValue(buildPosition(1));
            hierarchy.link.mockResolvedValue(
                PositionHierarchyDomain.create({
                    superiorPositionId: 1,
                    subordinatePositionId: 2,
                }),
            );

            await service.link(1, 2);

            expect(positions.getById).toHaveBeenNthCalledWith(1, 1);
            expect(positions.getById).toHaveBeenNthCalledWith(2, 2);
            expect(hierarchy.link).toHaveBeenCalledWith(1, 2);
        });
    });

    describe('unlink', () => {
        it('verifies both positions and unlinks the relation', async () => {
            positions.getById.mockResolvedValue(buildPosition(1));

            await service.unlink(1, 2);

            expect(hierarchy.unlink).toHaveBeenCalledWith(1, 2);
        });
    });

    describe('listSubordinates', () => {
        it('resolves each subordinate position from the relations', async () => {
            positions.getById.mockImplementation(async (id: number) =>
                buildPosition(id),
            );
            hierarchy.listSubordinates.mockResolvedValue([
                { subordinatePositionId: 2 },
                { subordinatePositionId: 3 },
            ]);

            const result = await service.listSubordinates(1);

            // First getById is the access check for the superior, then one per relation
            expect(positions.getById).toHaveBeenCalledWith(1);
            expect(result.map((p) => p.id)).toEqual([2, 3]);
        });
    });

    describe('listSuperiors', () => {
        it('resolves each superior position from the relations', async () => {
            positions.getById.mockImplementation(async (id: number) =>
                buildPosition(id),
            );
            hierarchy.listSuperiors.mockResolvedValue([
                { superiorPositionId: 7 },
                { superiorPositionId: 8 },
            ]);

            const result = await service.listSuperiors(2);

            expect(positions.getById).toHaveBeenCalledWith(2);
            expect(result.map((p) => p.id)).toEqual([7, 8]);
        });
    });
});
