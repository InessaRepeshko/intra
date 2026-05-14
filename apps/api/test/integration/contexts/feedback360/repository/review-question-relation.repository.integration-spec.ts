import '../../../setup-env';

import { AnswerType, ReviewStage } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { ReviewQuestionRelationDomain } from 'src/contexts/feedback360/domain/review-question-relation.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { QuestionRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/question.repository';
import { ReviewQuestionRelationRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review-question-relation.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('ReviewQuestionRelationRepository (integration)', () => {
    let module: TestingModule;
    let repo: ReviewQuestionRelationRepository;
    let reviews: ReviewRepository;
    let questions: QuestionRepository;
    let cycles: CycleRepository;
    let positions: PositionRepository;
    let competences: CompetenceRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let reviewId: number;
    let questionId: number;
    let competenceId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        repo = module.get(ReviewQuestionRelationRepository);
        reviews = module.get(ReviewRepository);
        questions = module.get(QuestionRepository);
        cycles = module.get(CycleRepository);
        positions = module.get(PositionRepository);
        competences = module.get(CompetenceRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetFeedback360Tables(prisma);
        const hr = await identityUsers.create({
            firstName: 'Helena',
            lastName: 'Reed',
            email: `hr.${Date.now()}@example.com`,
        } as any);
        const ratee = await identityUsers.create({
            firstName: 'Robert',
            lastName: 'Smith',
            email: `ratee.${Date.now()}@example.com`,
        } as any);
        const position = await positions.create(
            PositionDomain.create({ title: 'Engineer' }),
        );
        const cycle = await cycles.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hr.id!,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );
        const review = await reviews.create(
            ReviewDomain.create({
                rateeId: ratee.id!,
                rateeFullName: 'Robert Smith',
                rateePositionId: position.id!,
                rateePositionTitle: 'Engineer',
                hrId: hr.id!,
                hrFullName: 'Helena Reed',
                cycleId: cycle.id!,
                stage: ReviewStage.NEW,
            }),
        );
        const competence = await competences.create(
            CompetenceDomain.create({ title: 'Teamwork' }),
        );
        const question = await questions.create(
            QuestionDomain.create({
                cycleId: cycle.id!,
                title: 'Q?',
                answerType: AnswerType.NUMERICAL_SCALE,
                competenceId: competence.id!,
            }),
        );

        reviewId = review.id!;
        questionId = question.id!;
        competenceId = competence.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function buildRelation(
        overrides: Partial<{ questionTitle: string }> = {},
    ): ReviewQuestionRelationDomain {
        return ReviewQuestionRelationDomain.create({
            reviewId,
            questionId,
            questionTitle: overrides.questionTitle ?? 'Q?',
            answerType: AnswerType.NUMERICAL_SCALE,
            competenceId,
            competenceTitle: 'Teamwork',
        });
    }

    describe('link', () => {
        it('inserts a new relation', async () => {
            const created = await repo.link(buildRelation());

            expect(created.id).toBeDefined();
            expect(created.reviewId).toBe(reviewId);
            expect(created.questionId).toBe(questionId);
        });

        it('updates an existing relation on conflict (upsert)', async () => {
            const first = await repo.link(buildRelation());
            const second = await repo.link(
                buildRelation({ questionTitle: 'Updated title' }),
            );

            expect(second.id).toBe(first.id);
            expect(second.questionTitle).toBe('Updated title');

            const rows = await prisma.reviewQuestionRelation.findMany({
                where: { reviewId, questionId },
            });
            expect(rows).toHaveLength(1);
        });
    });

    describe('listByReview', () => {
        it('returns the relations attached to a review', async () => {
            await repo.link(buildRelation());

            const result = await repo.listByReview(reviewId, {} as any);

            expect(result).toHaveLength(1);
            expect(result[0].competenceTitle).toBe('Teamwork');
        });

        it('filters by questionTitle (case insensitive)', async () => {
            await repo.link(buildRelation({ questionTitle: 'Alpha?' }));

            const result = await repo.listByReview(reviewId, {
                questionTitle: 'alpha',
            } as any);

            expect(result).toHaveLength(1);
        });
    });

    describe('unlink', () => {
        it('removes the relation', async () => {
            await repo.link(buildRelation());

            await repo.unlink(reviewId, questionId);

            const rows = await prisma.reviewQuestionRelation.findMany({
                where: { reviewId, questionId },
            });
            expect(rows).toEqual([]);
        });
    });
});
