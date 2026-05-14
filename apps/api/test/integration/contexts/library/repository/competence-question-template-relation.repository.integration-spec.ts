import '../../../setup-env';

import { AnswerType, QuestionTemplateStatus } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CompetenceQuestionTemplateRelationDomain } from 'src/contexts/library/domain/competence-question-template-relation.domain';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { QuestionTemplateDomain } from 'src/contexts/library/domain/question-template.domain';
import { CompetenceQuestionTemplateRelationRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence-question-template-relation.repository';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { QuestionTemplateRepository } from 'src/contexts/library/infrastructure/prisma-repositories/question-template.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createLibraryTestModule,
    resetLibraryTables,
} from '../test-app-library';

describe('CompetenceQuestionTemplateRelationRepository (integration)', () => {
    let module: TestingModule;
    let repo: CompetenceQuestionTemplateRelationRepository;
    let competences: CompetenceRepository;
    let templates: QuestionTemplateRepository;
    let prisma: PrismaService;

    beforeAll(async () => {
        module = await createLibraryTestModule();
        repo = module.get(CompetenceQuestionTemplateRelationRepository);
        competences = module.get(CompetenceRepository);
        templates = module.get(QuestionTemplateRepository);
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
        return {
            competenceId: competence.id!,
            questionTemplateId: template.id!,
        };
    }

    describe('link', () => {
        it('creates a relation row', async () => {
            const { competenceId, questionTemplateId } = await setup();

            const created = await repo.link(competenceId, questionTemplateId);

            expect(created).toBeInstanceOf(
                CompetenceQuestionTemplateRelationDomain,
            );
            expect(created.competenceId).toBe(competenceId);
            expect(created.questionTemplateId).toBe(questionTemplateId);
        });

        it('is idempotent: returns the existing row on duplicate link', async () => {
            const { competenceId, questionTemplateId } = await setup();

            const first = await repo.link(competenceId, questionTemplateId);
            const second = await repo.link(competenceId, questionTemplateId);

            expect(second.id).toBe(first.id);
        });
    });

    describe('unlink', () => {
        it('removes the relation when it exists', async () => {
            const { competenceId, questionTemplateId } = await setup();
            await repo.link(competenceId, questionTemplateId);

            await repo.unlink(competenceId, questionTemplateId);

            const rows =
                await prisma.competenceQuestionTemplateRelation.findMany({
                    where: { competenceId, questionTemplateId },
                });
            expect(rows).toEqual([]);
        });
    });

    describe('listByCompetence / listByQuestionTemplate', () => {
        it('lists relations attached to a competence', async () => {
            const { competenceId, questionTemplateId: q1 } = await setup();
            // Second template under the same competence
            const q2 = (
                await templates.create(
                    QuestionTemplateDomain.create({
                        competenceId,
                        title: 'Q2',
                        answerType: AnswerType.TEXT_FIELD,
                        status: QuestionTemplateStatus.ACTIVE,
                    }),
                )
            ).id!;
            await repo.link(competenceId, q1);
            await repo.link(competenceId, q2);

            const result = await repo.listByCompetence(competenceId);

            expect(result.map((r) => r.questionTemplateId).sort()).toEqual(
                [q1, q2].sort(),
            );
        });

        it('lists relations attached to a question template', async () => {
            const { competenceId: c1, questionTemplateId } = await setup();
            const c2 = (
                await competences.create(
                    CompetenceDomain.create({ title: 'Leadership' }),
                )
            ).id!;
            await repo.link(c1, questionTemplateId);
            await repo.link(c2, questionTemplateId);

            const result =
                await repo.listByQuestionTemplate(questionTemplateId);

            expect(result.map((r) => r.competenceId).sort()).toEqual(
                [c1, c2].sort(),
            );
        });
    });

    describe('deleteAllForCompetence / deleteAllForQuestionTemplate', () => {
        it('deleteAllForCompetence wipes the competence side', async () => {
            const { competenceId, questionTemplateId } = await setup();
            await repo.link(competenceId, questionTemplateId);

            await repo.deleteAllForCompetence(competenceId);

            await expect(repo.listByCompetence(competenceId)).resolves.toEqual(
                [],
            );
        });

        it('deleteAllForQuestionTemplate wipes the template side', async () => {
            const { competenceId, questionTemplateId } = await setup();
            await repo.link(competenceId, questionTemplateId);

            await repo.deleteAllForQuestionTemplate(questionTemplateId);

            await expect(
                repo.listByQuestionTemplate(questionTemplateId),
            ).resolves.toEqual([]);
        });
    });
});
