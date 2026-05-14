import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { COMPETENCE_QUESTION_TEMPLATE_RELATION_REPOSITORY } from 'src/contexts/library/application/ports/competence-question-template-relation.repository.port';
import { COMPETENCE_REPOSITORY } from 'src/contexts/library/application/ports/competence.repository.port';
import { POSITION_COMPETENCE_RELATION_REPOSITORY } from 'src/contexts/library/application/ports/position-competence-relation.repository.port';
import { QUESTION_TEMPLATE_REPOSITORY } from 'src/contexts/library/application/ports/question-template.repository.port';
import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';

function buildCompetence(
    overrides: Partial<Parameters<typeof CompetenceDomain.create>[0]> = {},
): CompetenceDomain {
    return CompetenceDomain.create({
        id: 1,
        title: 'Teamwork',
        ...overrides,
    });
}

describe('CompetenceService', () => {
    let service: CompetenceService;
    let competences: any;
    let questionTemplates: any;
    let positionCompetenceRelations: any;
    let competenceQuestionTemplateRelations: any;
    let positions: any;

    beforeEach(async () => {
        competences = {
            create: jest.fn(),
            search: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
        };
        questionTemplates = { findById: jest.fn() };
        positionCompetenceRelations = {
            link: jest.fn(),
            unlink: jest.fn(),
            listByCompetence: jest.fn(),
            deleteAllForCompetence: jest.fn(),
        };
        competenceQuestionTemplateRelations = {
            link: jest.fn(),
            unlink: jest.fn(),
            listByCompetence: jest.fn(),
            deleteAllForCompetence: jest.fn(),
        };
        positions = { getById: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                CompetenceService,
                { provide: COMPETENCE_REPOSITORY, useValue: competences },
                {
                    provide: QUESTION_TEMPLATE_REPOSITORY,
                    useValue: questionTemplates,
                },
                {
                    provide: POSITION_COMPETENCE_RELATION_REPOSITORY,
                    useValue: positionCompetenceRelations,
                },
                {
                    provide: COMPETENCE_QUESTION_TEMPLATE_RELATION_REPOSITORY,
                    useValue: competenceQuestionTemplateRelations,
                },
                { provide: PositionService, useValue: positions },
            ],
        }).compile();

        service = module.get(CompetenceService);
    });

    describe('create', () => {
        it('persists the competence with null fallbacks for code and description', async () => {
            competences.create.mockImplementation(
                async (c: CompetenceDomain) => c,
            );

            await service.create({ title: 'Teamwork' });

            const passed = competences.create.mock.calls[0][0];
            expect(passed).toBeInstanceOf(CompetenceDomain);
            expect(passed.code).toBeNull();
            expect(passed.description).toBeNull();
        });

        it('passes through optional fields', async () => {
            competences.create.mockImplementation(
                async (c: CompetenceDomain) => c,
            );

            await service.create({
                title: 'Teamwork',
                code: 'TWK',
                description: 'desc',
            });

            const passed = competences.create.mock.calls[0][0];
            expect(passed.code).toBe('TWK');
            expect(passed.description).toBe('desc');
        });
    });

    describe('search', () => {
        it('delegates to the repository', async () => {
            competences.search.mockResolvedValue([]);
            await service.search({});
            expect(competences.search).toHaveBeenCalledWith({});
        });
    });

    describe('getById', () => {
        it('returns the competence when found', async () => {
            const competence = buildCompetence();
            competences.findById.mockResolvedValue(competence);
            await expect(service.getById(1)).resolves.toBe(competence);
        });

        it('throws NotFoundException when missing', async () => {
            competences.findById.mockResolvedValue(null);
            await expect(service.getById(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('throws NotFoundException when the competence does not exist', async () => {
            competences.findById.mockResolvedValue(null);
            await expect(
                service.update(1, { title: 'X' }),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('forwards only defined patch fields to the repository', async () => {
            competences.findById.mockResolvedValue(buildCompetence());
            competences.updateById.mockResolvedValue(buildCompetence());

            await service.update(1, { title: 'X' });

            expect(competences.updateById).toHaveBeenCalledWith(1, {
                title: 'X',
            });
        });
    });

    describe('delete', () => {
        it('rejects when related question templates exist', async () => {
            competences.findById.mockResolvedValue(buildCompetence());
            competenceQuestionTemplateRelations.listByCompetence.mockResolvedValue(
                [{ competenceId: 1, questionTemplateId: 5 }],
            );
            positionCompetenceRelations.listByCompetence.mockResolvedValue([]);

            await expect(service.delete(1)).rejects.toBeInstanceOf(
                BadRequestException,
            );
            expect(competences.deleteById).not.toHaveBeenCalled();
        });

        it('rejects when related positions exist', async () => {
            competences.findById.mockResolvedValue(buildCompetence());
            competenceQuestionTemplateRelations.listByCompetence.mockResolvedValue(
                [],
            );
            positionCompetenceRelations.listByCompetence.mockResolvedValue([
                { competenceId: 1, positionId: 5 },
            ]);

            await expect(service.delete(1)).rejects.toBeInstanceOf(
                BadRequestException,
            );
        });

        it('cleans up relations and deletes the competence when nothing is linked', async () => {
            competences.findById.mockResolvedValue(buildCompetence());
            competenceQuestionTemplateRelations.listByCompetence.mockResolvedValue(
                [],
            );
            positionCompetenceRelations.listByCompetence.mockResolvedValue([]);

            await service.delete(1);

            expect(
                positionCompetenceRelations.deleteAllForCompetence,
            ).toHaveBeenCalledWith(1);
            expect(
                competenceQuestionTemplateRelations.deleteAllForCompetence,
            ).toHaveBeenCalledWith(1);
            expect(competences.deleteById).toHaveBeenCalledWith(1);
        });
    });

    describe('attachPosition / detachPosition / listPositions', () => {
        beforeEach(() => {
            competences.findById.mockResolvedValue(buildCompetence());
        });

        it('attachPosition links the relation and returns updated position ids', async () => {
            positions.getById.mockResolvedValue({ id: 11 });
            positionCompetenceRelations.listByCompetence.mockResolvedValue([
                { competenceId: 1, positionId: 11 },
            ]);

            const result = await service.attachPosition(1, 11);

            expect(positions.getById).toHaveBeenCalledWith(11);
            expect(positionCompetenceRelations.link).toHaveBeenCalledWith(
                1,
                11,
            );
            expect(result).toEqual([11]);
        });

        it('detachPosition unlinks the relation', async () => {
            await service.detachPosition(1, 11);
            expect(positionCompetenceRelations.unlink).toHaveBeenCalledWith(
                1,
                11,
            );
        });

        it('listPositions maps relations to position ids', async () => {
            positionCompetenceRelations.listByCompetence.mockResolvedValue([
                { positionId: 11 },
                { positionId: 12 },
            ]);

            const result = await service.listPositions(1);
            expect(result).toEqual([11, 12]);
        });
    });

    describe('attachQuestionTemplate / detachQuestionTemplate / listQuestionTemplates', () => {
        beforeEach(() => {
            competences.findById.mockResolvedValue(buildCompetence());
        });

        it('throws NotFoundException when the question template does not exist', async () => {
            questionTemplates.findById.mockResolvedValue(null);

            await expect(
                service.attachQuestionTemplate(1, 50),
            ).rejects.toBeInstanceOf(NotFoundException);
            expect(
                competenceQuestionTemplateRelations.link,
            ).not.toHaveBeenCalled();
        });

        it('attachQuestionTemplate links and returns the updated ids', async () => {
            questionTemplates.findById.mockResolvedValue({ id: 50 });
            competenceQuestionTemplateRelations.listByCompetence.mockResolvedValue(
                [{ questionTemplateId: 50 }],
            );

            const result = await service.attachQuestionTemplate(1, 50);

            expect(
                competenceQuestionTemplateRelations.link,
            ).toHaveBeenCalledWith(1, 50);
            expect(result).toEqual([50]);
        });

        it('detachQuestionTemplate unlinks the relation', async () => {
            await service.detachQuestionTemplate(1, 50);
            expect(
                competenceQuestionTemplateRelations.unlink,
            ).toHaveBeenCalledWith(1, 50);
        });

        it('listQuestionTemplates maps relations to question template ids', async () => {
            competenceQuestionTemplateRelations.listByCompetence.mockResolvedValue(
                [
                    { questionTemplateId: 50 },
                    { questionTemplateId: 51 },
                ],
            );

            const result = await service.listQuestionTemplates(1);
            expect(result).toEqual([50, 51]);
        });
    });
});
