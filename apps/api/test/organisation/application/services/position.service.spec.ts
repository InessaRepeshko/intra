import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { POSITION_COMPETENCE_RELATION_REPOSITORY } from 'src/contexts/library/application/ports/position-competence-relation.repository.port';
import { ORGANISATION_POSITION_REPOSITORY } from 'src/contexts/organisation/application/ports/position.repository.port';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';

function buildPosition(
    overrides: Partial<Parameters<typeof PositionDomain.create>[0]> = {},
): PositionDomain {
    return PositionDomain.create({
        id: 1,
        title: 'Engineer',
        ...overrides,
    });
}

describe('PositionService', () => {
    let service: PositionService;
    let positions: any;
    let positionCompetenceRelations: any;

    beforeEach(async () => {
        positions = {
            create: jest.fn(),
            search: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
        };
        positionCompetenceRelations = { listByPosition: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                PositionService,
                {
                    provide: ORGANISATION_POSITION_REPOSITORY,
                    useValue: positions,
                },
                {
                    provide: POSITION_COMPETENCE_RELATION_REPOSITORY,
                    useValue: positionCompetenceRelations,
                },
            ],
        }).compile();

        service = module.get(PositionService);
    });

    describe('create', () => {
        it('persists the position with null fallback for description', async () => {
            positions.create.mockImplementation(
                async (p: PositionDomain) => p,
            );

            await service.create({ title: 'Engineer' });

            const passed = positions.create.mock.calls[0][0] as PositionDomain;
            expect(passed).toBeInstanceOf(PositionDomain);
            expect(passed.title).toBe('Engineer');
            expect(passed.description).toBeNull();
        });

        it('passes through optional description', async () => {
            positions.create.mockImplementation(
                async (p: PositionDomain) => p,
            );

            await service.create({
                title: 'Engineer',
                description: 'desc',
            });

            const passed = positions.create.mock.calls[0][0] as PositionDomain;
            expect(passed.description).toBe('desc');
        });
    });

    describe('search', () => {
        it('delegates to the repository', async () => {
            positions.search.mockResolvedValue([buildPosition()]);
            const result = await service.search({});
            expect(positions.search).toHaveBeenCalledWith({});
            expect(result).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('returns the position when found', async () => {
            const position = buildPosition();
            positions.findById.mockResolvedValue(position);
            await expect(service.getById(1)).resolves.toBe(position);
        });

        it('throws NotFoundException when missing', async () => {
            positions.findById.mockResolvedValue(null);
            await expect(service.getById(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('throws NotFoundException when the position does not exist', async () => {
            positions.findById.mockResolvedValue(null);
            await expect(
                service.update(1, { title: 'X' }),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('forwards the patch to the repository', async () => {
            positions.findById.mockResolvedValue(buildPosition());
            positions.updateById.mockResolvedValue(buildPosition());

            await service.update(1, { title: 'New', description: 'X' });

            expect(positions.updateById).toHaveBeenCalledWith(1, {
                title: 'New',
                description: 'X',
            });
        });
    });

    describe('delete', () => {
        it('throws NotFoundException when the position does not exist', async () => {
            positions.findById.mockResolvedValue(null);
            await expect(service.delete(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
            expect(positions.deleteById).not.toHaveBeenCalled();
        });

        it('rejects when there are competences linked to the position', async () => {
            positions.findById.mockResolvedValue(buildPosition());
            positionCompetenceRelations.listByPosition.mockResolvedValue([
                { competenceId: 7 },
            ]);

            await expect(service.delete(1)).rejects.toBeInstanceOf(
                BadRequestException,
            );
            expect(positions.deleteById).not.toHaveBeenCalled();
        });

        it('deletes the position when no competences are linked', async () => {
            positions.findById.mockResolvedValue(buildPosition());
            positionCompetenceRelations.listByPosition.mockResolvedValue([]);

            await service.delete(1);

            expect(positions.deleteById).toHaveBeenCalledWith(1);
        });
    });

    describe('listCompetences', () => {
        it('maps relations to competence ids', async () => {
            positions.findById.mockResolvedValue(buildPosition());
            positionCompetenceRelations.listByPosition.mockResolvedValue([
                { competenceId: 7 },
                { competenceId: 8 },
            ]);

            const result = await service.listCompetences(1);
            expect(result).toEqual([7, 8]);
        });
    });
});
