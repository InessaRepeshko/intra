import '../../../setup-env';

import { AnswerType, QuestionTemplateStatus } from '@intra/shared-kernel';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { PrismaService } from 'src/database/prisma.service';
import {
    createLibraryTestModule,
    resetLibraryTables,
} from '../test-app-library';

describe('CompetenceService (integration)', () => {
    let module: TestingModule;
    let service: CompetenceService;
    let positions: PositionService;
    let prisma: PrismaService;

    beforeAll(async () => {
        module = await createLibraryTestModule();
        service = module.get(CompetenceService);
        positions = module.get(PositionService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetLibraryTables(prisma);
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create', () => {
        it('persists a new competence with the supplied fields', async () => {
            const created = await service.create({
                code: 'C-1',
                title: 'Teamwork',
                description: 'Working in a team',
            });

            expect(created.id).toBeDefined();
            expect(created.code).toBe('C-1');
            expect(created.title).toBe('Teamwork');
            expect(created.description).toBe('Working in a team');

            const fromDb = await prisma.competence.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.title).toBe('Teamwork');
            expect(fromDb!.code).toBe('C-1');
        });

        it('coerces missing code/description to null', async () => {
            const created = await service.create({
                title: 'Leadership',
            } as any);

            expect(created.code).toBeNull();
            expect(created.description).toBeNull();

            const fromDb = await prisma.competence.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.code).toBeNull();
            expect(fromDb!.description).toBeNull();
        });
    });

    describe('search', () => {
        beforeEach(async () => {
            await service.create({
                code: 'C-A',
                title: 'Alpha',
                description: 'first',
            });
            await service.create({
                code: 'C-B',
                title: 'Beta',
                description: 'second',
            });
            await service.create({
                code: 'C-C',
                title: 'Gamma communication',
                description: 'third',
            });
        });

        it('returns all competences when no filter is supplied', async () => {
            const all = await service.search({} as any);
            expect(all).toHaveLength(3);
        });

        it('filters by title substring (case insensitive)', async () => {
            const result = await service.search({ title: 'GAMMA' } as any);
            expect(result.map((c) => c.title)).toEqual(['Gamma communication']);
        });

        it('filters by free-text "search" across title/code/description', async () => {
            const result = await service.search({ search: 'second' } as any);
            expect(result.map((c) => c.title)).toEqual(['Beta']);
        });
    });

    describe('getById', () => {
        it('returns the competence when found', async () => {
            const created = await service.create({
                title: 'Communication',
            } as any);

            await expect(service.getById(created.id!)).resolves.toBeInstanceOf(
                CompetenceDomain,
            );
        });

        it('throws NotFoundException for a missing id', async () => {
            await expect(service.getById(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('persists the patched fields and ignores undefined keys', async () => {
            const created = await service.create({
                title: 'Old',
                description: 'old desc',
            } as any);

            const updated = await service.update(created.id!, {
                title: 'New',
            } as any);

            expect(updated.title).toBe('New');
            expect(updated.description).toBe('old desc');

            const fromDb = await prisma.competence.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.title).toBe('New');
            expect(fromDb!.description).toBe('old desc');
        });

        it('throws NotFoundException when the competence is missing', async () => {
            await expect(
                service.update(999999, { title: 'X' } as any),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('delete', () => {
        it('removes the competence when nothing is linked', async () => {
            const created = await service.create({ title: 'Doomed' } as any);

            await service.delete(created.id!);

            const fromDb = await prisma.competence.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });

        it('throws NotFoundException for a missing competence', async () => {
            await expect(service.delete(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('rejects deletion when at least one position is linked', async () => {
            const competence = await service.create({
                title: 'Linked',
            } as any);
            const position = await positions.create({ title: 'Engineer' });

            await prisma.positionCompetenceRelation.create({
                data: {
                    positionId: position.id!,
                    competenceId: competence.id!,
                },
            });

            await expect(service.delete(competence.id!)).rejects.toBeInstanceOf(
                BadRequestException,
            );

            const stillThere = await prisma.competence.findUnique({
                where: { id: competence.id! },
            });
            expect(stillThere).not.toBeNull();
        });

        it('rejects deletion when at least one question template is linked', async () => {
            const competence = await service.create({
                title: 'Linked',
            } as any);
            const template = await prisma.questionTemplate.create({
                data: {
                    title: 'Q?',
                    answerType: AnswerType.NUMERICAL_SCALE,
                    competenceId: competence.id!,
                    status: QuestionTemplateStatus.ACTIVE,
                },
            });
            await prisma.competenceQuestionTemplateRelation.create({
                data: {
                    competenceId: competence.id!,
                    questionTemplateId: template.id,
                },
            });

            await expect(service.delete(competence.id!)).rejects.toBeInstanceOf(
                BadRequestException,
            );
        });
    });

    describe('attachPosition / detachPosition / listPositions', () => {
        it('links a competence to a position and returns the new list', async () => {
            const competence = await service.create({
                title: 'Communication',
            } as any);
            const position = await positions.create({ title: 'Engineer' });

            const ids = await service.attachPosition(
                competence.id!,
                position.id!,
            );

            expect(ids).toEqual([position.id]);
        });

        it('is idempotent: attaching the same position twice keeps a single row', async () => {
            const competence = await service.create({ title: 'C' } as any);
            const position = await positions.create({ title: 'P' });

            await service.attachPosition(competence.id!, position.id!);
            const ids = await service.attachPosition(
                competence.id!,
                position.id!,
            );

            expect(ids).toEqual([position.id]);

            const rows = await prisma.positionCompetenceRelation.findMany({
                where: { competenceId: competence.id! },
            });
            expect(rows).toHaveLength(1);
        });

        it('throws NotFoundException when the position is missing', async () => {
            const competence = await service.create({ title: 'C' } as any);

            await expect(
                service.attachPosition(competence.id!, 999999),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('detachPosition removes the relation', async () => {
            const competence = await service.create({ title: 'C' } as any);
            const position = await positions.create({ title: 'P' });
            await service.attachPosition(competence.id!, position.id!);

            await service.detachPosition(competence.id!, position.id!);

            await expect(
                service.listPositions(competence.id!),
            ).resolves.toEqual([]);
        });

        it('detachPosition is a no-op when no relation exists', async () => {
            const competence = await service.create({ title: 'C' } as any);
            const position = await positions.create({ title: 'P' });

            await expect(
                service.detachPosition(competence.id!, position.id!),
            ).resolves.toBeUndefined();
        });
    });

    describe('attachQuestionTemplate / detachQuestionTemplate / listQuestionTemplates', () => {
        async function makeTemplate(competenceId: number): Promise<number> {
            const created = await prisma.questionTemplate.create({
                data: {
                    title: 'Q?',
                    answerType: AnswerType.NUMERICAL_SCALE,
                    competenceId,
                    status: QuestionTemplateStatus.ACTIVE,
                },
            });
            return created.id;
        }

        it('links and returns the templates attached to the competence', async () => {
            const competence = await service.create({ title: 'C' } as any);
            const templateId = await makeTemplate(competence.id!);

            const ids = await service.attachQuestionTemplate(
                competence.id!,
                templateId,
            );

            expect(ids).toEqual([templateId]);
        });

        it('throws NotFoundException when the question template is missing', async () => {
            const competence = await service.create({ title: 'C' } as any);

            await expect(
                service.attachQuestionTemplate(competence.id!, 999999),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('detachQuestionTemplate removes the relation', async () => {
            const competence = await service.create({ title: 'C' } as any);
            const templateId = await makeTemplate(competence.id!);
            await service.attachQuestionTemplate(competence.id!, templateId);

            await service.detachQuestionTemplate(competence.id!, templateId);

            await expect(
                service.listQuestionTemplates(competence.id!),
            ).resolves.toEqual([]);
        });
    });
});
