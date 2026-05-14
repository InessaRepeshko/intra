jest.mock('better-auth', () => ({ betterAuth: jest.fn(() => ({})) }));
jest.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: jest.fn(() => ({})),
}));

import {
    AnswerType,
    IdentityRole,
    RespondentCategory,
    ResponseStatus,
    ReviewStage,
} from '@intra/shared-kernel';
import { ReviewService } from 'src/contexts/feedback360/application/services/review.service';
import { AnswerDomain } from 'src/contexts/feedback360/domain/answer.domain';
import { RespondentDomain } from 'src/contexts/feedback360/domain/respondent.domain';
import { ReviewQuestionRelationDomain } from 'src/contexts/feedback360/domain/review-question-relation.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { ReviewerDomain } from 'src/contexts/feedback360/domain/reviewer.domain';
import { ReviewController } from 'src/contexts/feedback360/presentation/http/controllers/reviews.controller';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';

function buildReview(
    overrides: Partial<Parameters<typeof ReviewDomain.create>[0]> = {},
): ReviewDomain {
    return ReviewDomain.create({
        id: 1,
        rateeId: 11,
        rateeFullName: 'Ratee',
        rateePositionId: 1,
        rateePositionTitle: 'Engineer',
        hrId: 2,
        hrFullName: 'HR',
        ...overrides,
    });
}

describe('ReviewController', () => {
    let controller: ReviewController;
    let reviews: any;
    const actor = UserDomain.create({
        id: 7,
        firstName: 'HR',
        lastName: 'Admin',
        email: 'hr@example.com',
        roles: [IdentityRole.HR],
    });

    beforeEach(() => {
        reviews = {
            create: jest.fn(),
            search: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            attachQuestion: jest.fn(),
            listQuestionRelations: jest.fn(),
            detachQuestion: jest.fn(),
            addAnswer: jest.fn(),
            listAnswers: jest.fn(),
            countReviewAnswers: jest.fn(),
            addRespondent: jest.fn(),
            listRespondents: jest.fn(),
            updateRespondent: jest.fn(),
            removeRespondent: jest.fn(),
            addReviewer: jest.fn(),
            listReviewers: jest.fn(),
            removeReviewer: jest.fn(),
            forceFinishReview: jest.fn(),
        };

        controller = new ReviewController(reviews as unknown as ReviewService);
    });

    describe('create', () => {
        it('returns the http response for the created review', async () => {
            reviews.create.mockResolvedValue(buildReview());
            const dto = { rateeId: 11 } as any;

            const result = await controller.create(dto);

            expect(reviews.create).toHaveBeenCalledWith(dto);
            expect(result.id).toBe(1);
            expect(result.rateeFullName).toBe('Ratee');
        });
    });

    describe('search', () => {
        it('passes actor to the service and maps results', async () => {
            reviews.search.mockResolvedValue([buildReview({ id: 1 })]);

            const result = await controller.search({} as any, actor);

            expect(reviews.search).toHaveBeenCalledWith({}, actor);
            expect(result).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('parses the id and forwards the actor', async () => {
            reviews.getById.mockResolvedValue(buildReview({ id: 42 }));
            const result = await controller.getById('42', actor);
            expect(reviews.getById).toHaveBeenCalledWith(42, actor);
            expect(result.id).toBe(42);
        });
    });

    describe('update', () => {
        it('passes actor and parsed id to the service', async () => {
            reviews.update.mockResolvedValue(
                buildReview({ stage: ReviewStage.SELF_ASSESSMENT }),
            );
            const dto = { stage: ReviewStage.SELF_ASSESSMENT } as any;

            const result = await controller.update('1', dto, actor);

            expect(reviews.update).toHaveBeenCalledWith(1, dto, actor);
            expect(result.stage).toBe(ReviewStage.SELF_ASSESSMENT);
        });
    });

    describe('delete', () => {
        it('parses the id and calls the service', async () => {
            await controller.delete('1');
            expect(reviews.delete).toHaveBeenCalledWith(1);
        });
    });

    describe('attachQuestion', () => {
        it('forwards the dto with the parsed review id', async () => {
            reviews.attachQuestion.mockResolvedValue(
                ReviewQuestionRelationDomain.create({
                    id: 1,
                    reviewId: 1,
                    questionId: 5,
                    questionTitle: 'Q',
                    answerType: AnswerType.NUMERICAL_SCALE,
                    competenceId: 3,
                    competenceTitle: 'Teamwork',
                }),
            );

            const result = await controller.attachQuestion('1', {
                questionTemplateId: 5,
            } as any);

            expect(reviews.attachQuestion).toHaveBeenCalledWith({
                reviewId: 1,
                questionTemplateId: 5,
            });
            expect(result.questionId).toBe(5);
        });
    });

    describe('listQuestions', () => {
        it('forwards the request to listQuestionRelations and maps results', async () => {
            reviews.listQuestionRelations.mockResolvedValue([
                ReviewQuestionRelationDomain.create({
                    id: 1,
                    reviewId: 1,
                    questionId: 5,
                    questionTitle: 'Q',
                    answerType: AnswerType.NUMERICAL_SCALE,
                    competenceId: 3,
                    competenceTitle: 'C',
                }),
            ]);

            const result = await controller.listQuestions(
                '1',
                {} as any,
                actor,
            );

            expect(reviews.listQuestionRelations).toHaveBeenCalledWith(
                1,
                {},
                actor,
            );
            expect(result).toHaveLength(1);
        });
    });

    describe('detachQuestion', () => {
        it('parses both path params', async () => {
            await controller.detachQuestion('1', '5');
            expect(reviews.detachQuestion).toHaveBeenCalledWith(1, 5);
        });
    });

    describe('addAnswer', () => {
        it('forwards a numerical answer payload', async () => {
            const created = AnswerDomain.create({
                id: 1,
                reviewId: 1,
                questionId: 5,
                respondentCategory: RespondentCategory.TEAM,
                answerType: AnswerType.NUMERICAL_SCALE,
                numericalValue: 4,
            });
            reviews.addAnswer.mockResolvedValue(created);

            const dto = {
                questionId: 5,
                respondentCategory: RespondentCategory.TEAM,
                answerType: AnswerType.NUMERICAL_SCALE,
                numericalValue: 4,
            } as any;

            const result = await controller.addAnswer('1', dto, actor);

            expect(reviews.addAnswer).toHaveBeenCalledWith(
                {
                    reviewId: 1,
                    questionId: 5,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    numericalValue: 4,
                    textValue: undefined,
                },
                actor,
            );
            expect(result.numericalValue).toBe(4);
        });
    });

    describe('listAnswers', () => {
        it('passes the respondentCategory query through', async () => {
            reviews.listAnswers.mockResolvedValue([]);
            await controller.listAnswers(
                '1',
                { respondentCategory: RespondentCategory.TEAM } as any,
                actor,
            );
            expect(reviews.listAnswers).toHaveBeenCalledWith(
                1,
                RespondentCategory.TEAM,
                actor,
            );
        });
    });

    describe('countAnswers', () => {
        it('returns the count from the service', async () => {
            reviews.countReviewAnswers.mockResolvedValue(5);
            const count = await controller.countAnswers('1', actor);
            expect(reviews.countReviewAnswers).toHaveBeenCalledWith(1, actor);
            expect(count).toBe(5);
        });
    });

    describe('addRespondent', () => {
        it('builds the payload from path id and body', async () => {
            const created = RespondentDomain.create({
                id: 99,
                reviewId: 1,
                respondentId: 50,
                fullName: 'John Doe',
                category: RespondentCategory.TEAM,
                responseStatus: ResponseStatus.PENDING,
                positionId: 3,
                positionTitle: 'Engineer',
            });
            reviews.addRespondent.mockResolvedValue(created);

            const dto = {
                respondentId: 50,
                fullName: 'John Doe',
                category: RespondentCategory.TEAM,
                responseStatus: ResponseStatus.PENDING,
                positionId: 3,
                positionTitle: 'Engineer',
            } as any;

            const result = await controller.addRespondent('1', dto);

            const call = reviews.addRespondent.mock.calls[0][0];
            expect(call.reviewId).toBe(1);
            expect(call.respondentId).toBe(50);
            expect(result.id).toBe(99);
        });
    });

    describe('listRespondents', () => {
        it('forwards the call with actor and query', async () => {
            reviews.listRespondents.mockResolvedValue([]);
            await controller.listRespondents('1', {} as any, actor);
            expect(reviews.listRespondents).toHaveBeenCalledWith(1, {}, actor);
        });
    });

    describe('updateRespondent', () => {
        it('parses the relation id and forwards the dto and actor', async () => {
            reviews.updateRespondent.mockResolvedValue(
                RespondentDomain.create({
                    id: 7,
                    reviewId: 1,
                    respondentId: 50,
                    fullName: 'John',
                    category: RespondentCategory.TEAM,
                    positionId: 3,
                    positionTitle: 'Engineer',
                }),
            );

            await controller.updateRespondent(
                '7',
                { hrNote: 'x' } as any,
                actor,
            );
            expect(reviews.updateRespondent).toHaveBeenCalledWith(
                7,
                { hrNote: 'x' },
                actor,
            );
        });
    });

    describe('deleteRespondent', () => {
        it('parses the id and forwards the call', async () => {
            await controller.deleteRespondent('5');
            expect(reviews.removeRespondent).toHaveBeenCalledWith(5);
        });
    });

    describe('addReviewer', () => {
        it('builds the payload from the path id and body', async () => {
            reviews.addReviewer.mockResolvedValue(
                ReviewerDomain.create({
                    id: 1,
                    reviewId: 1,
                    reviewerId: 80,
                    fullName: 'Reviewer',
                    positionId: 3,
                    positionTitle: 'Eng',
                }),
            );

            await controller.addReviewer('1', {
                reviewerId: 80,
                fullName: 'Reviewer',
                positionId: 3,
                positionTitle: 'Eng',
            } as any);

            const call = reviews.addReviewer.mock.calls[0][0];
            expect(call.reviewId).toBe(1);
            expect(call.reviewerId).toBe(80);
        });
    });

    describe('listReviewers', () => {
        it('forwards the call and maps results', async () => {
            reviews.listReviewers.mockResolvedValue([]);
            await controller.listReviewers('1', {} as any, actor);
            expect(reviews.listReviewers).toHaveBeenCalledWith(1, {}, actor);
        });
    });

    describe('deleteReviewer', () => {
        it('parses the id and forwards the call', async () => {
            await controller.deleteReviewer('5');
            expect(reviews.removeReviewer).toHaveBeenCalledWith(5);
        });
    });

    describe('forceFinish', () => {
        it('forwards the actor info and returns the refreshed review', async () => {
            reviews.getById.mockResolvedValue(
                buildReview({ stage: ReviewStage.FINISHED }),
            );

            const result = await controller.forceFinish('1', actor);

            expect(reviews.forceFinishReview).toHaveBeenCalledWith(
                1,
                actor.id,
                actor.fullName,
            );
            expect(reviews.getById).toHaveBeenCalledWith(1);
            expect(result.stage).toBe(ReviewStage.FINISHED);
        });
    });
});
