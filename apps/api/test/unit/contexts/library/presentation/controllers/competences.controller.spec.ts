jest.mock('better-auth', () => ({ betterAuth: jest.fn(() => ({})) }));
jest.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: jest.fn(() => ({})),
}));

import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { CompetencesController } from 'src/contexts/library/presentation/http/controllers/competences.controller';

function buildCompetence(): CompetenceDomain {
    return CompetenceDomain.create({
        id: 1,
        code: 'TWK',
        title: 'Teamwork',
        description: 'desc',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    });
}

describe('CompetencesController', () => {
    let controller: CompetencesController;
    let service: any;

    beforeEach(() => {
        service = {
            create: jest.fn(),
            search: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            attachPosition: jest.fn(),
            detachPosition: jest.fn(),
            listPositions: jest.fn(),
            attachQuestionTemplate: jest.fn(),
            detachQuestionTemplate: jest.fn(),
            listQuestionTemplates: jest.fn(),
        };

        controller = new CompetencesController(
            service as unknown as CompetenceService,
        );
    });

    describe('create', () => {
        it('forwards the dto and maps the response', async () => {
            service.create.mockResolvedValue(buildCompetence());

            const result = await controller.create({
                code: 'TWK',
                title: 'Teamwork',
                description: 'desc',
            } as any);

            expect(service.create).toHaveBeenCalledWith({
                code: 'TWK',
                title: 'Teamwork',
                description: 'desc',
            });
            expect(result.id).toBe(1);
        });
    });

    describe('search', () => {
        it('maps every competence to a response', async () => {
            service.search.mockResolvedValue([buildCompetence()]);
            const result = await controller.search({} as any);
            expect(service.search).toHaveBeenCalledWith({});
            expect(result).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('parses the id and forwards to the service', async () => {
            service.getById.mockResolvedValue(buildCompetence());
            const result = await controller.getById('1');
            expect(service.getById).toHaveBeenCalledWith(1);
            expect(result.id).toBe(1);
        });
    });

    describe('update', () => {
        it('parses the id and forwards the dto', async () => {
            service.update.mockResolvedValue(buildCompetence());
            await controller.update('1', { title: 'X' } as any);
            expect(service.update).toHaveBeenCalledWith(1, { title: 'X' });
        });
    });

    describe('delete', () => {
        it('parses the id and forwards to the service', async () => {
            await controller.delete('1');
            expect(service.delete).toHaveBeenCalledWith(1);
        });
    });

    describe('attachPosition', () => {
        it('parses the path id and forwards the dto', async () => {
            service.attachPosition.mockResolvedValue([11]);
            const result = await controller.attachPosition('1', {
                positionId: 11,
            } as any);
            expect(service.attachPosition).toHaveBeenCalledWith(1, 11);
            expect(result).toEqual([11]);
        });
    });

    describe('detachPosition', () => {
        it('parses both ids and forwards the call', async () => {
            await controller.detachPosition('1', '11');
            expect(service.detachPosition).toHaveBeenCalledWith(1, 11);
        });
    });

    describe('listPositions', () => {
        it('forwards the call and returns the result', async () => {
            service.listPositions.mockResolvedValue([1, 2]);
            const result = await controller.listPositions('1');
            expect(service.listPositions).toHaveBeenCalledWith(1);
            expect(result).toEqual([1, 2]);
        });
    });

    describe('attachQuestionTemplate', () => {
        it('parses the path id and forwards the dto', async () => {
            service.attachQuestionTemplate.mockResolvedValue([50]);
            const result = await controller.attachQuestionTemplate('1', {
                questionTemplateId: 50,
            } as any);
            expect(service.attachQuestionTemplate).toHaveBeenCalledWith(1, 50);
            expect(result).toEqual([50]);
        });
    });

    describe('detachQuestionTemplate', () => {
        it('parses both ids and forwards the call', async () => {
            await controller.detachQuestionTemplate('1', '50');
            expect(service.detachQuestionTemplate).toHaveBeenCalledWith(1, 50);
        });
    });

    describe('listQuestionTemplates', () => {
        it('forwards the call and returns the result', async () => {
            service.listQuestionTemplates.mockResolvedValue([50]);
            const result = await controller.listQuestionTemplates('1');
            expect(service.listQuestionTemplates).toHaveBeenCalledWith(1);
            expect(result).toEqual([50]);
        });
    });
});
