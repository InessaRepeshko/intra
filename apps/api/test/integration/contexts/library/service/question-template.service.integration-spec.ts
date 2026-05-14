import '../../../setup-env';

import { AnswerType, QuestionTemplateStatus } from '@intra/shared-kernel';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import { QuestionTemplateService } from 'src/contexts/library/application/services/question-template.service';
import { QuestionTemplateDomain } from 'src/contexts/library/domain/question-template.domain';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { PrismaService } from 'src/database/prisma.service';
import {
    createLibraryTestModule,
    resetLibraryTables,
} from '../test-app-library';

describe('QuestionTemplateService (integration)', () => {
    let module: TestingModule;
    let service: QuestionTemplateService;
    let competences: CompetenceService;
    let positions: PositionService;
    let prisma: PrismaService;
    let competenceId: number;

    beforeAll(async () => {
        module = await createLibraryTestModule();
        service = module.get(QuestionTemplateService);
        competences = module.get(CompetenceService);
        positions = module.get(PositionService);
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
        it('persists a template with defaults applied', async () => {
            const created = await service.create({
                competenceId,
                title: 'Rate teamwork',
                answerType: AnswerType.NUMERICAL_SCALE,
            } as any);

            expect(created).toBeInstanceOf(QuestionTemplateDomain);
            expect(created.competenceId).toBe(competenceId);
            expect(created.status).toBe(QuestionTemplateStatus.ACTIVE);
            expect(created.isForSelfassessment).toBe(false);
            expect(created.positionIds).toEqual([]);

            const fromDb = await prisma.questionTemplate.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.title).toBe('Rate teamwork');
        });

        it('throws NotFoundException when the competence is missing', async () => {
            await expect(
                service.create({
                    competenceId: 999999,
                    title: 'Q',
                    answerType: AnswerType.TEXT_FIELD,
                } as any),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('attaches the supplied positions', async () => {
            const p1 = await positions.create({ title: 'Engineer' });
            const p2 = await positions.create({ title: 'Manager' });

            const created = await service.create({
                competenceId,
                title: 'Q',
                answerType: AnswerType.TEXT_FIELD,
                positionIds: [p1.id!, p2.id!],
            } as any);

            expect(created.positionIds.sort()).toEqual([p1.id!, p2.id!].sort());

            const rows = await prisma.positionQuestionTemplateRelation.findMany(
                {
                    where: { questionTemplateId: created.id! },
                },
            );
            expect(rows).toHaveLength(2);
        });

        it('rejects creation when one of the supplied positions does not exist', async () => {
            const p1 = await positions.create({ title: 'Engineer' });

            await expect(
                service.create({
                    competenceId,
                    title: 'Q',
                    answerType: AnswerType.TEXT_FIELD,
                    positionIds: [p1.id!, 999999],
                } as any),
            ).rejects.toThrow();
        });
    });

    describe('search / getById', () => {
        it('search filters by competenceId', async () => {
            const other = await competences.create({
                title: 'Other',
            } as any);

            await service.create({
                competenceId,
                title: 'A',
                answerType: AnswerType.TEXT_FIELD,
            } as any);
            await service.create({
                competenceId: other.id!,
                title: 'B',
                answerType: AnswerType.TEXT_FIELD,
            } as any);

            const result = await service.search({ competenceId } as any);

            expect(result).toHaveLength(1);
            expect(result[0].title).toBe('A');
        });

        it('getById throws NotFoundException when missing', async () => {
            await expect(service.getById(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('persists patched scalar fields', async () => {
            const created = await service.create({
                competenceId,
                title: 'Q',
                answerType: AnswerType.TEXT_FIELD,
            } as any);

            const updated = await service.update(created.id!, {
                title: 'Q2',
            } as any);

            expect(updated.title).toBe('Q2');

            const fromDb = await prisma.questionTemplate.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.title).toBe('Q2');
        });

        it('validates the new competenceId when changed', async () => {
            const created = await service.create({
                competenceId,
                title: 'Q',
                answerType: AnswerType.TEXT_FIELD,
            } as any);

            await expect(
                service.update(created.id!, {
                    competenceId: 999999,
                } as any),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('delete', () => {
        it('removes the template and its relations when nothing references it', async () => {
            const created = await service.create({
                competenceId,
                title: 'Q',
                answerType: AnswerType.TEXT_FIELD,
            } as any);

            await service.delete(created.id!);

            const fromDb = await prisma.questionTemplate.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });

        it('rejects deletion when a review question references the template', async () => {
            const template = await service.create({
                competenceId,
                title: 'Q',
                answerType: AnswerType.NUMERICAL_SCALE,
            } as any);

            await prisma.question.create({
                data: {
                    title: 'Q?',
                    answerType: 'NUMERICAL_SCALE' as any,
                    questionTemplateId: template.id!,
                },
            });

            await expect(service.delete(template.id!)).rejects.toBeInstanceOf(
                BadRequestException,
            );

            const stillThere = await prisma.questionTemplate.findUnique({
                where: { id: template.id! },
            });
            expect(stillThere).not.toBeNull();
        });
    });

    describe('attachPosition / detachPosition / listPositions', () => {
        it('links a template to a position and lists it back', async () => {
            const template = await service.create({
                competenceId,
                title: 'Q',
                answerType: AnswerType.TEXT_FIELD,
            } as any);
            const position = await positions.create({ title: 'Engineer' });

            const ids = await service.attachPosition(
                template.id!,
                position.id!,
            );

            expect(ids).toEqual([position.id]);
        });

        it('throws NotFoundException when the position does not exist', async () => {
            const template = await service.create({
                competenceId,
                title: 'Q',
                answerType: AnswerType.TEXT_FIELD,
            } as any);

            await expect(
                service.attachPosition(template.id!, 999999),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('detachPosition removes the relation', async () => {
            const template = await service.create({
                competenceId,
                title: 'Q',
                answerType: AnswerType.TEXT_FIELD,
            } as any);
            const position = await positions.create({ title: 'Engineer' });
            await service.attachPosition(template.id!, position.id!);

            await service.detachPosition(template.id!, position.id!);

            await expect(service.listPositions(template.id!)).resolves.toEqual(
                [],
            );
        });
    });

    describe('attachCompetence / detachCompetence / listCompetences', () => {
        it('links a template to a competence and lists it back', async () => {
            const template = await service.create({
                competenceId,
                title: 'Q',
                answerType: AnswerType.TEXT_FIELD,
            } as any);
            const otherCompetence = await competences.create({
                title: 'Other',
            } as any);

            const ids = await service.attachCompetence(
                template.id!,
                otherCompetence.id!,
            );

            expect(ids).toEqual([otherCompetence.id]);
        });

        it('throws NotFoundException when the competence does not exist', async () => {
            const template = await service.create({
                competenceId,
                title: 'Q',
                answerType: AnswerType.TEXT_FIELD,
            } as any);

            await expect(
                service.attachCompetence(template.id!, 999999),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('detachCompetence removes the relation', async () => {
            const template = await service.create({
                competenceId,
                title: 'Q',
                answerType: AnswerType.TEXT_FIELD,
            } as any);
            const otherCompetence = await competences.create({
                title: 'Other',
            } as any);
            await service.attachCompetence(template.id!, otherCompetence.id!);

            await service.detachCompetence(template.id!, otherCompetence.id!);

            await expect(
                service.listCompetences(template.id!),
            ).resolves.toEqual([]);
        });
    });
});
