import '../../../setup-env';

import { AnswerType, QuestionTemplateStatus } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { PositionQuestionTemplateRelationDomain } from 'src/contexts/library/domain/position-question-template-relation.domain';
import { QuestionTemplateDomain } from 'src/contexts/library/domain/question-template.domain';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { PositionQuestionTemplateRelationRepository } from 'src/contexts/library/infrastructure/prisma-repositories/position-question-template-relation.repository';
import { QuestionTemplateRepository } from 'src/contexts/library/infrastructure/prisma-repositories/question-template.repository';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createLibraryTestModule,
    resetLibraryTables,
} from '../test-app-library';

describe('PositionQuestionTemplateRelationRepository (integration)', () => {
    let module: TestingModule;
    let repo: PositionQuestionTemplateRelationRepository;
    let templates: QuestionTemplateRepository;
    let competences: CompetenceRepository;
    let positions: PositionRepository;
    let prisma: PrismaService;

    beforeAll(async () => {
        module = await createLibraryTestModule();
        repo = module.get(PositionQuestionTemplateRelationRepository);
        templates = module.get(QuestionTemplateRepository);
        competences = module.get(CompetenceRepository);
        positions = module.get(PositionRepository);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetLibraryTables(prisma);
    });

    afterAll(async () => {
        await module.close();
    });

    async function setup() {
        const competence = await competences.create(
            CompetenceDomain.create({ title: 'Teamwork' }),
        );
        const template = await templates.create(
            QuestionTemplateDomain.create({
                competenceId: competence.id!,
                title: 'Q?',
                answerType: AnswerType.NUMERICAL_SCALE,
                status: QuestionTemplateStatus.ACTIVE,
            }),
        );
        const position = await positions.create(
            PositionDomain.create({ title: 'Engineer' }),
        );
        return { templateId: template.id!, positionId: position.id! };
    }

    describe('link', () => {
        it('creates a relation row', async () => {
            const { templateId, positionId } = await setup();

            const created = await repo.link(templateId, positionId);

            expect(created).toBeInstanceOf(
                PositionQuestionTemplateRelationDomain,
            );
            expect(created.questionTemplateId).toBe(templateId);
            expect(created.positionId).toBe(positionId);
        });

        it('is idempotent: returns the existing row on duplicate link', async () => {
            const { templateId, positionId } = await setup();

            const first = await repo.link(templateId, positionId);
            const second = await repo.link(templateId, positionId);

            expect(second.id).toBe(first.id);

            const rows = await prisma.positionQuestionTemplateRelation.findMany(
                {
                    where: {
                        questionTemplateId: templateId,
                        positionId,
                    },
                },
            );
            expect(rows).toHaveLength(1);
        });
    });

    describe('unlink', () => {
        it('removes the relation when it exists', async () => {
            const { templateId, positionId } = await setup();
            await repo.link(templateId, positionId);

            await repo.unlink(templateId, positionId);

            const rows = await prisma.positionQuestionTemplateRelation.findMany(
                {
                    where: {
                        questionTemplateId: templateId,
                        positionId,
                    },
                },
            );
            expect(rows).toEqual([]);
        });
    });

    describe('listByQuestion', () => {
        it('returns all relations attached to a question template', async () => {
            const { templateId, positionId: p1 } = await setup();
            const p2 = (
                await positions.create(
                    PositionDomain.create({ title: 'Manager' }),
                )
            ).id!;
            await repo.link(templateId, p1);
            await repo.link(templateId, p2);

            const result = await repo.listByQuestion(templateId);

            expect(result.map((r) => r.positionId).sort()).toEqual(
                [p1, p2].sort(),
            );
        });
    });

    describe('replace', () => {
        it('keeps the supplied positions and drops the others', async () => {
            const { templateId, positionId: p1 } = await setup();
            const p2 = (
                await positions.create(
                    PositionDomain.create({ title: 'Manager' }),
                )
            ).id!;
            const p3 = (
                await positions.create(
                    PositionDomain.create({ title: 'Director' }),
                )
            ).id!;
            await repo.link(templateId, p1);
            await repo.link(templateId, p2);

            const result = await repo.replace(templateId, [p2, p3]);

            expect(result.map((r) => r.positionId).sort()).toEqual(
                [p2, p3].sort(),
            );
        });

        it('removes all relations when the new list is empty', async () => {
            const { templateId, positionId } = await setup();
            await repo.link(templateId, positionId);

            const result = await repo.replace(templateId, []);

            expect(result).toEqual([]);
        });

        it('deduplicates the input list', async () => {
            const { templateId, positionId } = await setup();

            const result = await repo.replace(templateId, [
                positionId,
                positionId,
            ]);

            expect(result).toHaveLength(1);
            expect(result[0].positionId).toBe(positionId);
        });
    });

    describe('deleteAllForQuestionTemplate', () => {
        it('removes every relation tied to the template', async () => {
            const { templateId, positionId: p1 } = await setup();
            const p2 = (
                await positions.create(
                    PositionDomain.create({ title: 'Manager' }),
                )
            ).id!;
            await repo.link(templateId, p1);
            await repo.link(templateId, p2);

            await repo.deleteAllForQuestionTemplate(templateId);

            await expect(repo.listByQuestion(templateId)).resolves.toEqual([]);
        });
    });
});
