jest.mock('better-auth', () => ({ betterAuth: jest.fn(() => ({})) }));
jest.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: jest.fn(() => ({})),
}));

import { AnswerType, QuestionTemplateStatus } from '@intra/shared-kernel';
import { QuestionTemplateService } from 'src/contexts/library/application/services/question-template.service';
import { QuestionTemplateDomain } from 'src/contexts/library/domain/question-template.domain';
import { QuestionTemplatesController } from 'src/contexts/library/presentation/http/controllers/question-templates.controller';

function buildTemplate(): QuestionTemplateDomain {
    return QuestionTemplateDomain.create({
        id: 1,
        title: 'Q?',
        answerType: AnswerType.NUMERICAL_SCALE,
        competenceId: 7,
        status: QuestionTemplateStatus.ACTIVE,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    });
}

describe('QuestionTemplatesController', () => {
    let controller: QuestionTemplatesController;
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
            attachCompetence: jest.fn(),
            detachCompetence: jest.fn(),
            listCompetences: jest.fn(),
        };

        controller = new QuestionTemplatesController(
            service as unknown as QuestionTemplateService,
        );
    });

    describe('create', () => {
        it('forwards the dto and maps the response', async () => {
            service.create.mockResolvedValue(buildTemplate());

            const result = await controller.create({
                competenceId: 7,
                title: 'Q?',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: false,
                status: QuestionTemplateStatus.ACTIVE,
                positionIds: [1, 2],
            } as any);

            expect(service.create).toHaveBeenCalledWith({
                competenceId: 7,
                title: 'Q?',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: false,
                status: QuestionTemplateStatus.ACTIVE,
                positionIds: [1, 2],
            });
            expect(result.id).toBe(1);
        });
    });

    describe('search', () => {
        it('maps every template to a response', async () => {
            service.search.mockResolvedValue([buildTemplate()]);
            const result = await controller.search({} as any);
            expect(service.search).toHaveBeenCalledWith({});
            expect(result).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('parses the id and forwards to the service', async () => {
            service.getById.mockResolvedValue(buildTemplate());
            const result = await controller.getById('1');
            expect(service.getById).toHaveBeenCalledWith(1);
            expect(result.id).toBe(1);
        });
    });

    describe('update', () => {
        it('parses the id and forwards the dto', async () => {
            service.update.mockResolvedValue(buildTemplate());
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

    describe('attachCompetence', () => {
        it('parses the path id and forwards the dto', async () => {
            service.attachCompetence.mockResolvedValue([7]);
            const result = await controller.attachCompetence('1', {
                competenceId: 7,
            } as any);
            expect(service.attachCompetence).toHaveBeenCalledWith(1, 7);
            expect(result).toEqual([7]);
        });
    });

    describe('detachCompetence', () => {
        it('parses both ids and forwards the call', async () => {
            await controller.detachCompetence('1', '7');
            expect(service.detachCompetence).toHaveBeenCalledWith(1, 7);
        });
    });

    describe('listCompetences', () => {
        it('forwards the call and returns the result', async () => {
            service.listCompetences.mockResolvedValue([7]);
            const result = await controller.listCompetences('1');
            expect(service.listCompetences).toHaveBeenCalledWith(1);
            expect(result).toEqual([7]);
        });
    });
});
