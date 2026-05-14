import { AnswerType, QuestionTemplateStatus } from '@intra/shared-kernel';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { QUESTION_REPOSITORY } from 'src/contexts/feedback360/application/ports/question.repository.port';
import { COMPETENCE_QUESTION_TEMPLATE_RELATION_REPOSITORY } from 'src/contexts/library/application/ports/competence-question-template-relation.repository.port';
import { POSITION_QUESTION_TEMPLATE_RELATION_REPOSITORY } from 'src/contexts/library/application/ports/position-question-template-relation.repository.port';
import { QUESTION_TEMPLATE_REPOSITORY } from 'src/contexts/library/application/ports/question-template.repository.port';
import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import { QuestionTemplateService } from 'src/contexts/library/application/services/question-template.service';
import { QuestionTemplateDomain } from 'src/contexts/library/domain/question-template.domain';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';

function buildTemplate(
    overrides: Partial<Parameters<typeof QuestionTemplateDomain.create>[0]> = {},
): QuestionTemplateDomain {
    return QuestionTemplateDomain.create({
        id: 1,
        title: 'Q?',
        answerType: AnswerType.NUMERICAL_SCALE,
        competenceId: 7,
        ...overrides,
    });
}

describe('QuestionTemplateService', () => {
    let service: QuestionTemplateService;
    let templates: any;
    let positionRelations: any;
    let competenceRelations: any;
    let competences: any;
    let positions: any;
    let reviewQuestions: any;

    beforeEach(async () => {
        templates = {
            create: jest.fn(),
            search: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
        };
        positionRelations = {
            replace: jest.fn(),
            link: jest.fn(),
            unlink: jest.fn(),
            listByQuestion: jest.fn(),
            deleteAllForQuestionTemplate: jest.fn(),
        };
        competenceRelations = {
            link: jest.fn(),
            unlink: jest.fn(),
            listByQuestionTemplate: jest.fn(),
            deleteAllForQuestionTemplate: jest.fn(),
        };
        competences = { getById: jest.fn() };
        positions = { getById: jest.fn() };
        reviewQuestions = { search: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                QuestionTemplateService,
                { provide: QUESTION_TEMPLATE_REPOSITORY, useValue: templates },
                {
                    provide: POSITION_QUESTION_TEMPLATE_RELATION_REPOSITORY,
                    useValue: positionRelations,
                },
                {
                    provide: COMPETENCE_QUESTION_TEMPLATE_RELATION_REPOSITORY,
                    useValue: competenceRelations,
                },
                { provide: CompetenceService, useValue: competences },
                { provide: PositionService, useValue: positions },
                { provide: QUESTION_REPOSITORY, useValue: reviewQuestions },
            ],
        }).compile();

        service = module.get(QuestionTemplateService);
    });

    describe('create', () => {
        it('verifies the competence exists and persists the template', async () => {
            competences.getById.mockResolvedValue({ id: 7 });
            const created = buildTemplate();
            templates.create.mockResolvedValue(created);
            templates.findById.mockResolvedValue(created);

            const result = await service.create({
                title: 'Q?',
                answerType: AnswerType.NUMERICAL_SCALE,
                competenceId: 7,
            });

            expect(competences.getById).toHaveBeenCalledWith(7);
            const passed = templates.create.mock.calls[0][0];
            expect(passed).toBeInstanceOf(QuestionTemplateDomain);
            expect(passed.status).toBe(QuestionTemplateStatus.ACTIVE);
            expect(passed.positionIds).toEqual([]);
            expect(result).toBe(created);
        });

        it('replaces position relations after creation when positionIds are supplied', async () => {
            competences.getById.mockResolvedValue({ id: 7 });
            const created = buildTemplate({ id: 42 });
            templates.create.mockResolvedValue(created);
            templates.findById.mockResolvedValue(created);
            positions.getById.mockResolvedValue({ id: 1 });

            await service.create({
                title: 'Q?',
                answerType: AnswerType.NUMERICAL_SCALE,
                competenceId: 7,
                positionIds: [1, 1, 2], // duplicates should be deduped
            });

            expect(positions.getById).toHaveBeenCalledTimes(2);
            expect(positionRelations.replace).toHaveBeenCalledWith(42, [1, 2]);
        });
    });

    describe('search', () => {
        it('delegates to the repository', async () => {
            templates.search.mockResolvedValue([]);
            await service.search({});
            expect(templates.search).toHaveBeenCalledWith({});
        });
    });

    describe('getById', () => {
        it('returns the template when found', async () => {
            const template = buildTemplate();
            templates.findById.mockResolvedValue(template);
            await expect(service.getById(1)).resolves.toBe(template);
        });

        it('throws NotFoundException when missing', async () => {
            templates.findById.mockResolvedValue(null);
            await expect(service.getById(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('verifies a new competence id when one is supplied', async () => {
            templates.findById.mockResolvedValue(
                buildTemplate({ competenceId: 7 }),
            );
            competences.getById.mockResolvedValue({ id: 9 });
            templates.updateById.mockResolvedValue(undefined);

            await service.update(1, { competenceId: 9 });

            expect(competences.getById).toHaveBeenCalledWith(9);
        });

        it('replaces position relations when positionIds are supplied', async () => {
            templates.findById.mockResolvedValue(buildTemplate({ id: 1 }));
            positions.getById.mockResolvedValue({ id: 3 });

            await service.update(1, { positionIds: [3, 3, 4] });

            expect(positionRelations.replace).toHaveBeenCalledWith(1, [3, 4]);
        });

        it('forwards only defined patch fields to the repository', async () => {
            templates.findById.mockResolvedValue(buildTemplate());

            await service.update(1, { title: 'New' });

            expect(templates.updateById).toHaveBeenCalledWith(1, {
                title: 'New',
            });
        });
    });

    describe('delete', () => {
        it('rejects when related review questions exist', async () => {
            templates.findById.mockResolvedValue(buildTemplate());
            reviewQuestions.search.mockResolvedValue([{ id: 1 }]);

            await expect(service.delete(1)).rejects.toBeInstanceOf(
                BadRequestException,
            );
            expect(templates.deleteById).not.toHaveBeenCalled();
        });

        it('cleans up relations and deletes the template when nothing is linked', async () => {
            templates.findById.mockResolvedValue(buildTemplate());
            reviewQuestions.search.mockResolvedValue([]);

            await service.delete(1);

            expect(
                positionRelations.deleteAllForQuestionTemplate,
            ).toHaveBeenCalledWith(1);
            expect(
                competenceRelations.deleteAllForQuestionTemplate,
            ).toHaveBeenCalledWith(1);
            expect(templates.deleteById).toHaveBeenCalledWith(1);
        });
    });

    describe('attachPosition / detachPosition / listPositions', () => {
        beforeEach(() => {
            templates.findById.mockResolvedValue(buildTemplate());
        });

        it('attachPosition links the relation and returns updated ids', async () => {
            positions.getById.mockResolvedValue({ id: 11 });
            positionRelations.listByQuestion.mockResolvedValue([
                { positionId: 11 },
            ]);

            const result = await service.attachPosition(1, 11);

            expect(positionRelations.link).toHaveBeenCalledWith(1, 11);
            expect(result).toEqual([11]);
        });

        it('detachPosition unlinks the relation', async () => {
            await service.detachPosition(1, 11);
            expect(positionRelations.unlink).toHaveBeenCalledWith(1, 11);
        });

        it('listPositions maps relations to position ids', async () => {
            positionRelations.listByQuestion.mockResolvedValue([
                { positionId: 11 },
                { positionId: 12 },
            ]);

            const result = await service.listPositions(1);
            expect(result).toEqual([11, 12]);
        });
    });

    describe('attachCompetence / detachCompetence / listCompetences', () => {
        beforeEach(() => {
            templates.findById.mockResolvedValue(buildTemplate());
        });

        it('attachCompetence verifies the competence and links the relation', async () => {
            competences.getById.mockResolvedValue({ id: 7 });
            competenceRelations.listByQuestionTemplate.mockResolvedValue([
                { competenceId: 7 },
            ]);

            const result = await service.attachCompetence(1, 7);

            expect(competences.getById).toHaveBeenCalledWith(7);
            expect(competenceRelations.link).toHaveBeenCalledWith(7, 1);
            expect(result).toEqual([7]);
        });

        it('detachCompetence unlinks the relation', async () => {
            await service.detachCompetence(1, 7);
            expect(competenceRelations.unlink).toHaveBeenCalledWith(7, 1);
        });

        it('listCompetences maps relations to competence ids', async () => {
            competenceRelations.listByQuestionTemplate.mockResolvedValue([
                { competenceId: 7 },
                { competenceId: 8 },
            ]);

            const result = await service.listCompetences(1);
            expect(result).toEqual([7, 8]);
        });
    });
});
