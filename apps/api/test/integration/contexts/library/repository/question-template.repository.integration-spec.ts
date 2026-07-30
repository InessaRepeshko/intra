import '../../../setup-env';

import {
    AnswerType,
    QuestionTemplateSortField,
    QuestionTemplateStatus,
    SortDirection,
} from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { QuestionTemplateDomain } from 'src/contexts/library/domain/question-template.domain';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { QuestionTemplateRepository } from 'src/contexts/library/infrastructure/prisma-repositories/question-template.repository';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createLibraryTestModule,
    resetLibraryTables,
} from '../test-app-library';

describe('QuestionTemplateRepository (integration)', () => {
    let module: TestingModule;
    let repo: QuestionTemplateRepository;
    let competences: CompetenceRepository;
    let positions: PositionRepository;
    let prisma: PrismaService;
    let competenceId: number;

    beforeAll(async () => {
        module = await createLibraryTestModule();
        repo = module.get(QuestionTemplateRepository);
        competences = module.get(CompetenceRepository);
        positions = module.get(PositionRepository);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetLibraryTables(prisma);
        const competence = await competences.create(
            CompetenceDomain.create({ title: 'Teamwork' }),
        );
        competenceId = competence.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create', () => {
        it('persists a template with no position relations', async () => {
            const created = await repo.create(
                QuestionTemplateDomain.create({
                    competenceId,
                    title: 'Q?',
                    answerType: AnswerType.NUMERICAL_SCALE,
                    status: QuestionTemplateStatus.ACTIVE,
                }),
            );

            expect(created.id).toBeDefined();
            expect(created.positionIds).toEqual([]);
        });

        it('persists the supplied position relations', async () => {
            const p1 = await positions.create(
                PositionDomain.create({ title: 'Engineer' }),
            );
            const p2 = await positions.create(
                PositionDomain.create({ title: 'Manager' }),
            );

            const created = await repo.create(
                QuestionTemplateDomain.create({
                    competenceId,
                    title: 'Q?',
                    answerType: AnswerType.NUMERICAL_SCALE,
                    positionIds: [p1.id!, p2.id!],
                }),
            );

            expect(created.positionIds.sort()).toEqual([p1.id!, p2.id!].sort());

            const rows = await prisma.positionQuestionTemplateRelation.findMany(
                {
                    where: { questionTemplateId: created.id! },
                },
            );
            expect(rows).toHaveLength(2);
        });
    });

    describe('findById', () => {
        it('returns the template when found', async () => {
            const created = await repo.create(
                QuestionTemplateDomain.create({
                    competenceId,
                    title: 'Q?',
                    answerType: AnswerType.TEXT_FIELD,
                }),
            );

            await expect(repo.findById(created.id!)).resolves.toBeInstanceOf(
                QuestionTemplateDomain,
            );
        });

        it('returns null when missing', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });

    describe('search', () => {
        beforeEach(async () => {
            await repo.create(
                QuestionTemplateDomain.create({
                    competenceId,
                    title: 'Alpha',
                    answerType: AnswerType.TEXT_FIELD,
                    status: QuestionTemplateStatus.ACTIVE,
                }),
            );
            await repo.create(
                QuestionTemplateDomain.create({
                    competenceId,
                    title: 'Beta',
                    answerType: AnswerType.NUMERICAL_SCALE,
                    status: QuestionTemplateStatus.ARCHIVE,
                }),
            );
        });

        it('returns all when no filter is supplied', async () => {
            const all = await repo.search({} as any);
            expect(all).toHaveLength(2);
        });

        it('filters by status', async () => {
            const result = await repo.search({
                status: QuestionTemplateStatus.ARCHIVE,
            } as any);
            expect(result.map((q) => q.title)).toEqual(['Beta']);
        });

        it('filters by answerType', async () => {
            const result = await repo.search({
                answerType: AnswerType.NUMERICAL_SCALE,
            } as any);
            expect(result.map((q) => q.title)).toEqual(['Beta']);
        });

        it('honours descending sort on title', async () => {
            const result = await repo.search({
                sortBy: QuestionTemplateSortField.TITLE,
                sortDirection: SortDirection.DESC,
            } as any);
            const titles = result.map((q) => q.title);
            expect(titles).toEqual([...titles].sort().reverse());
        });
    });

    describe('updateById', () => {
        it('persists the patched scalar fields', async () => {
            const created = await repo.create(
                QuestionTemplateDomain.create({
                    competenceId,
                    title: 'Q?',
                    answerType: AnswerType.TEXT_FIELD,
                }),
            );

            const updated = await repo.updateById(created.id!, {
                title: 'NEW',
            } as any);

            expect(updated.title).toBe('NEW');
        });
    });

    describe('deleteById', () => {
        it('removes the template row', async () => {
            const created = await repo.create(
                QuestionTemplateDomain.create({
                    competenceId,
                    title: 'Q?',
                    answerType: AnswerType.TEXT_FIELD,
                }),
            );

            await repo.deleteById(created.id!);

            const fromDb = await prisma.questionTemplate.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });
    });
});
