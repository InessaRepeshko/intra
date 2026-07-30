import '../../../setup-env';

import {
    AnswerSortField,
    AnswerType,
    RespondentCategory,
    ReviewStage,
    SortDirection,
} from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { AnswerDomain } from 'src/contexts/feedback360/domain/answer.domain';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { AnswerRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/answer.repository';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { QuestionRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/question.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('AnswerRepository (integration)', () => {
    let module: TestingModule;
    let repo: AnswerRepository;
    let reviews: ReviewRepository;
    let questions: QuestionRepository;
    let cycles: CycleRepository;
    let positions: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let reviewId: number;
    let questionId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        repo = module.get(AnswerRepository);
        reviews = module.get(ReviewRepository);
        questions = module.get(QuestionRepository);
        cycles = module.get(CycleRepository);
        positions = module.get(PositionRepository);
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
                stage: ReviewStage.IN_PROGRESS,
            }),
        );
        const question = await questions.create(
            QuestionDomain.create({
                cycleId: cycle.id!,
                title: 'Q?',
                answerType: AnswerType.NUMERICAL_SCALE,
            }),
        );

        reviewId = review.id!;
        questionId = question.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create / findById / list', () => {
        it('persists a numerical answer', async () => {
            const created = await repo.create(
                AnswerDomain.create({
                    reviewId,
                    questionId,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    numericalValue: 4,
                }),
            );

            expect(created.id).toBeDefined();
            expect(created.numericalValue).toBe(4);
            expect(created.textValue).toBeNull();
        });

        it('persists a text answer', async () => {
            const created = await repo.create(
                AnswerDomain.create({
                    reviewId,
                    questionId,
                    respondentCategory: RespondentCategory.OTHER,
                    answerType: AnswerType.TEXT_FIELD,
                    textValue: 'Great teamwork',
                }),
            );

            expect(created.textValue).toBe('Great teamwork');
            expect(created.numericalValue).toBeNull();
        });

        it('findById returns the answer when found', async () => {
            const created = await repo.create(
                AnswerDomain.create({
                    reviewId,
                    questionId,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    numericalValue: 5,
                }),
            );

            await expect(repo.findById(created.id!)).resolves.toBeInstanceOf(
                AnswerDomain,
            );
        });

        it('findById returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });

        it('list filters by reviewId', async () => {
            await repo.create(
                AnswerDomain.create({
                    reviewId,
                    questionId,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    numericalValue: 3,
                }),
            );

            const result = await repo.list({ reviewId } as any);

            expect(result).toHaveLength(1);
        });

        it('list filters by respondentCategory', async () => {
            await repo.create(
                AnswerDomain.create({
                    reviewId,
                    questionId,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    numericalValue: 3,
                }),
            );
            await repo.create(
                AnswerDomain.create({
                    reviewId,
                    questionId,
                    respondentCategory: RespondentCategory.SELF_ASSESSMENT,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    numericalValue: 4,
                }),
            );

            const result = await repo.list({
                respondentCategory: RespondentCategory.SELF_ASSESSMENT,
            } as any);

            expect(result).toHaveLength(1);
            expect(result[0].numericalValue).toBe(4);
        });

        it('list honours sort direction', async () => {
            await repo.create(
                AnswerDomain.create({
                    reviewId,
                    questionId,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    numericalValue: 1,
                }),
            );
            await repo.create(
                AnswerDomain.create({
                    reviewId,
                    questionId,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    numericalValue: 5,
                }),
            );

            const result = await repo.list({
                sortBy: AnswerSortField.NUMERICAL_VALUE,
                sortDirection: SortDirection.DESC,
            } as any);

            expect(result[0].numericalValue).toBe(5);
        });
    });

    describe('getAnswersCountByRespondentCategories', () => {
        it('returns an empty list when there are no answers', async () => {
            const result =
                await repo.getAnswersCountByRespondentCategories(reviewId);

            expect(result).toEqual([]);
        });

        it('counts answers per respondent and aggregates by category', async () => {
            // 2 team respondents, both answered the single question
            for (let i = 0; i < 2; i++) {
                await repo.create(
                    AnswerDomain.create({
                        reviewId,
                        questionId,
                        respondentCategory: RespondentCategory.TEAM,
                        answerType: AnswerType.NUMERICAL_SCALE,
                        numericalValue: 4,
                    }),
                );
            }

            const result =
                await repo.getAnswersCountByRespondentCategories(reviewId);

            expect(result).toEqual([
                { respondentCategory: RespondentCategory.TEAM, answers: 2 },
            ]);
        });
    });

    describe('deleteById', () => {
        it('removes the answer row', async () => {
            const created = await repo.create(
                AnswerDomain.create({
                    reviewId,
                    questionId,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    numericalValue: 4,
                }),
            );

            await repo.deleteById(created.id!);

            const fromDb = await prisma.answer.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });
    });
});
