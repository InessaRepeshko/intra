import {
    AnswerType,
    CycleStage,
    IdentityRole,
    RespondentCategory,
    ResponseStatus,
    ReviewStage,
} from '@intra/shared-kernel';
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { TRANSITION_REASONS as REVIEW_TRANSITION_REASONS } from 'src/contexts/feedback360/application/constants/review-stage-transitions';
import { ReviewStageChangedEvent } from 'src/contexts/feedback360/application/events/review-stage-changed.event';
import { ANSWER_REPOSITORY } from 'src/contexts/feedback360/application/ports/answer.repository.port';
import { CLUSTER_SCORE_REPOSITORY } from 'src/contexts/feedback360/application/ports/cluster-score.repository.port';
import { QUESTION_REPOSITORY } from 'src/contexts/feedback360/application/ports/question.repository.port';
import { RESPONDENT_REPOSITORY } from 'src/contexts/feedback360/application/ports/respondent.repository.port';
import { REVIEW_QUESTION_RELATION_REPOSITORY } from 'src/contexts/feedback360/application/ports/review-question-relation.repository.port';
import { REVIEW_STAGE_HISTORY_REPOSITORY } from 'src/contexts/feedback360/application/ports/review-stage-history.repository.port';
import { REVIEW_REPOSITORY } from 'src/contexts/feedback360/application/ports/review.repository.port';
import { REVIEWER_REPOSITORY } from 'src/contexts/feedback360/application/ports/reviewer.repository.port';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import { ReviewService } from 'src/contexts/feedback360/application/services/review.service';
import { ClusterScoreDomain } from 'src/contexts/feedback360/domain/cluster-score.domain';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { RespondentDomain } from 'src/contexts/feedback360/domain/respondent.domain';
import { ReviewQuestionRelationDomain } from 'src/contexts/feedback360/domain/review-question-relation.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { ReviewerDomain } from 'src/contexts/feedback360/domain/reviewer.domain';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import { QuestionTemplateService } from 'src/contexts/library/application/services/question-template.service';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { QuestionTemplateDomain } from 'src/contexts/library/domain/question-template.domain';
import { PrismaService } from 'src/database/prisma.service';

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
        cycleId: 50,
        ...overrides,
    });
}

function buildRespondent(
    overrides: Partial<Parameters<typeof RespondentDomain.create>[0]> = {},
): RespondentDomain {
    return RespondentDomain.create({
        id: 1,
        reviewId: 1,
        respondentId: 100,
        fullName: 'John Doe',
        category: RespondentCategory.TEAM,
        positionId: 1,
        positionTitle: 'Engineer',
        ...overrides,
    });
}

function buildUser(
    overrides: Partial<Parameters<typeof UserDomain.create>[0]> = {},
): UserDomain {
    return UserDomain.create({
        id: 200,
        firstName: 'Actor',
        lastName: 'User',
        email: 'actor@example.com',
        roles: [IdentityRole.HR],
        ...overrides,
    });
}

describe('ReviewService', () => {
    let service: ReviewService;
    let reviews: any;
    let questions: any;
    let questionRelations: any;
    let answers: any;
    let respondents: any;
    let reviewers: any;
    let clusterScores: any;
    let stageHistory: any;
    let questionTemplates: any;
    let competences: any;
    let cycles: any;
    let prisma: any;
    let eventEmitter: any;
    let txReviewUpdate: jest.Mock;

    beforeEach(async () => {
        reviews = {
            create: jest.fn(),
            search: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
            listByCycleId: jest.fn(),
        };
        questions = {
            create: jest.fn(),
            search: jest.fn(),
            findById: jest.fn(),
            deleteById: jest.fn(),
        };
        questionRelations = {
            link: jest.fn(),
            listByReview: jest.fn(),
            unlink: jest.fn(),
        };
        answers = {
            create: jest.fn(),
            list: jest.fn(),
            getAnswersCountByRespondentCategories: jest.fn(),
        };
        respondents = {
            create: jest.fn(),
            getById: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
            listByReview: jest.fn(),
        };
        reviewers = {
            create: jest.fn(),
            listByReview: jest.fn(),
            deleteById: jest.fn(),
        };
        clusterScores = {
            upsert: jest.fn(),
            list: jest.fn(),
            getById: jest.fn(),
            getByCycleId: jest.fn(),
            deleteById: jest.fn(),
        };
        stageHistory = {
            create: jest.fn(),
            findByReviewId: jest.fn(),
        };
        questionTemplates = { getById: jest.fn() };
        competences = { getById: jest.fn() };
        cycles = { getById: jest.fn() };
        eventEmitter = { emit: jest.fn() };
        txReviewUpdate = jest.fn();
        prisma = {
            $transaction: jest.fn(async (cb) =>
                cb({ review: { update: txReviewUpdate } }),
            ),
        };

        const module = await Test.createTestingModule({
            providers: [
                ReviewService,
                { provide: REVIEW_REPOSITORY, useValue: reviews },
                { provide: QUESTION_REPOSITORY, useValue: questions },
                {
                    provide: REVIEW_QUESTION_RELATION_REPOSITORY,
                    useValue: questionRelations,
                },
                { provide: ANSWER_REPOSITORY, useValue: answers },
                { provide: RESPONDENT_REPOSITORY, useValue: respondents },
                { provide: REVIEWER_REPOSITORY, useValue: reviewers },
                { provide: CLUSTER_SCORE_REPOSITORY, useValue: clusterScores },
                {
                    provide: REVIEW_STAGE_HISTORY_REPOSITORY,
                    useValue: stageHistory,
                },
                { provide: PrismaService, useValue: prisma },
                {
                    provide: QuestionTemplateService,
                    useValue: questionTemplates,
                },
                { provide: CompetenceService, useValue: competences },
                { provide: CycleService, useValue: cycles },
                { provide: EventEmitter2, useValue: eventEmitter },
            ],
        }).compile();

        service = module.get(ReviewService);
    });

    describe('create', () => {
        it('verifies the cycle exists before creating the review when cycleId is provided', async () => {
            const created = buildReview();
            reviews.create.mockResolvedValue(created);
            reviews.findById.mockResolvedValue(created);
            cycles.getById.mockResolvedValue({ id: 50, stage: CycleStage.NEW });

            await service.create({
                rateeId: 11,
                rateeFullName: 'Ratee',
                rateePositionId: 1,
                rateePositionTitle: 'Engineer',
                hrId: 2,
                hrFullName: 'HR',
                cycleId: 50,
            });

            expect(cycles.getById).toHaveBeenCalledWith(50);
            expect(reviews.create).toHaveBeenCalledTimes(1);
            expect(reviews.findById).toHaveBeenCalledWith(created.id);
        });

        it('does not call cycles.getById when no cycleId is provided', async () => {
            const created = buildReview({ cycleId: null });
            reviews.create.mockResolvedValue(created);
            reviews.findById.mockResolvedValue(created);

            await service.create({
                rateeId: 11,
                rateeFullName: 'Ratee',
                rateePositionId: 1,
                rateePositionTitle: 'Engineer',
                hrId: 2,
                hrFullName: 'HR',
            });

            expect(cycles.getById).not.toHaveBeenCalled();
        });
    });

    describe('getById', () => {
        it('throws NotFoundException when the review is missing', async () => {
            reviews.findById.mockResolvedValue(null);
            await expect(service.getById(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('returns the review when no actor is provided', async () => {
            const review = buildReview();
            reviews.findById.mockResolvedValue(review);
            await expect(service.getById(1)).resolves.toBe(review);
        });

        it('returns the review for admin/HR actors', async () => {
            const review = buildReview();
            reviews.findById.mockResolvedValue(review);
            const actor = buildUser({ roles: [IdentityRole.ADMIN] });
            await expect(service.getById(1, actor)).resolves.toBe(review);
        });

        it('returns the review when actor is the ratee', async () => {
            const review = buildReview({ rateeId: 200 });
            reviews.findById.mockResolvedValue(review);
            const actor = buildUser({
                id: 200,
                roles: [IdentityRole.EMPLOYEE],
            });
            await expect(service.getById(1, actor)).resolves.toBe(review);
        });

        it('returns the review when actor is the manager', async () => {
            const review = buildReview({ managerId: 200 });
            reviews.findById.mockResolvedValue(review);
            const actor = buildUser({ id: 200, roles: [IdentityRole.MANAGER] });
            await expect(service.getById(1, actor)).resolves.toBe(review);
        });

        it('returns the review when actor is a respondent', async () => {
            const review = buildReview();
            reviews.findById.mockResolvedValue(review);
            respondents.listByReview.mockResolvedValue([buildRespondent()]);
            reviewers.listByReview.mockResolvedValue([]);
            const actor = buildUser({
                id: 999,
                roles: [IdentityRole.EMPLOYEE],
            });
            await expect(service.getById(1, actor)).resolves.toBe(review);
        });

        it('returns the review when actor is a reviewer', async () => {
            const review = buildReview();
            reviews.findById.mockResolvedValue(review);
            respondents.listByReview.mockResolvedValue([]);
            reviewers.listByReview.mockResolvedValue([{ id: 1 }]);
            const actor = buildUser({
                id: 999,
                roles: [IdentityRole.EMPLOYEE],
            });
            await expect(service.getById(1, actor)).resolves.toBe(review);
        });

        it('throws ForbiddenException when actor has no access', async () => {
            const review = buildReview();
            reviews.findById.mockResolvedValue(review);
            respondents.listByReview.mockResolvedValue([]);
            reviewers.listByReview.mockResolvedValue([]);
            const actor = buildUser({
                id: 999,
                roles: [IdentityRole.EMPLOYEE],
            });
            await expect(service.getById(1, actor)).rejects.toBeInstanceOf(
                ForbiddenException,
            );
        });
    });

    describe('search', () => {
        it('filters out reviews the actor cannot read', async () => {
            const accessible = buildReview({ id: 1, rateeId: 200 });
            const inaccessible = buildReview({ id: 2, rateeId: 5 });
            reviews.search.mockResolvedValue([accessible, inaccessible]);
            respondents.listByReview.mockResolvedValue([]);
            reviewers.listByReview.mockResolvedValue([]);

            const actor = buildUser({
                id: 200,
                roles: [IdentityRole.EMPLOYEE],
            });
            const result = await service.search({}, actor);

            expect(result).toEqual([accessible]);
        });

        it('returns all reviews for admin/HR actors', async () => {
            const a = buildReview({ id: 1 });
            const b = buildReview({ id: 2 });
            reviews.search.mockResolvedValue([a, b]);

            const actor = buildUser({ roles: [IdentityRole.HR] });
            const result = await service.search({}, actor);

            expect(result).toEqual([a, b]);
        });
    });

    describe('update', () => {
        it('rejects updates when the review is not NEW or PROCESSING_BY_HR', async () => {
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.IN_PROGRESS }),
            );
            const actor = buildUser();
            await expect(
                service.update(1, { hrNote: 'note' }, actor),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('rejects reassigning to a cycle outside NEW/ACTIVE', async () => {
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.NEW }),
            );
            cycles.getById.mockResolvedValue({
                id: 50,
                stage: CycleStage.FINISHED,
            });
            const actor = buildUser();
            await expect(
                service.update(1, { cycleId: 50 }, actor),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('allows updating an editable field and forwards only defined fields', async () => {
            const review = buildReview({ stage: ReviewStage.NEW });
            reviews.findById.mockResolvedValue(review);
            reviews.updateById.mockResolvedValue({
                ...review,
                hrNote: 'note',
            });
            const actor = buildUser();

            await service.update(1, { hrNote: 'note' }, actor);

            expect(reviews.updateById).toHaveBeenCalledWith(1, {
                hrNote: 'note',
            });
        });

        it('runs changeReviewStage on a valid non-FINISHED stage patch', async () => {
            const review = buildReview({ stage: ReviewStage.NEW });
            reviews.findById.mockResolvedValue(review);
            reviews.updateById.mockResolvedValue(review);

            const actor = buildUser();
            await service.update(
                1,
                { stage: ReviewStage.SELF_ASSESSMENT },
                actor,
            );

            // changeReviewStage uses prisma.$transaction
            expect(prisma.$transaction).toHaveBeenCalled();
            expect(txReviewUpdate).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { stage: ReviewStage.SELF_ASSESSMENT },
            });
            expect(eventEmitter.emit).toHaveBeenCalledWith(
                'review.stage.changed',
                expect.any(ReviewStageChangedEvent),
            );
        });
    });

    describe('delete', () => {
        it('throws when the review has answers already submitted', async () => {
            reviews.findById.mockResolvedValue(buildReview());
            answers.list.mockResolvedValue([{ id: 1 }]);
            await expect(service.delete(1)).rejects.toBeInstanceOf(
                BadRequestException,
            );
        });

        it('deletes when there are no answers', async () => {
            reviews.findById.mockResolvedValue(buildReview());
            answers.list.mockResolvedValue([]);
            await service.delete(1);
            expect(reviews.deleteById).toHaveBeenCalledWith(1);
        });
    });

    describe('createQuestion', () => {
        it('rejects when the cycle is not in NEW/ACTIVE stage', async () => {
            cycles.getById.mockResolvedValue({
                id: 50,
                stage: CycleStage.FINISHED,
            });
            await expect(
                service.createQuestion({
                    cycleId: 50,
                    title: 'Q',
                    answerType: AnswerType.NUMERICAL_SCALE,
                }),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('falls back to template fields when payload fields are missing', async () => {
            cycles.getById.mockResolvedValue({
                id: 50,
                stage: CycleStage.ACTIVE,
            });
            questionTemplates.getById.mockResolvedValue(
                QuestionTemplateDomain.create({
                    id: 7,
                    title: 'Template title',
                    answerType: AnswerType.TEXT_FIELD,
                    competenceId: 3,
                    isForSelfassessment: true,
                }),
            );
            const created = QuestionDomain.create({
                id: 8,
                title: 'Template title',
                answerType: AnswerType.TEXT_FIELD,
                competenceId: 3,
                isForSelfassessment: true,
            });
            questions.create.mockResolvedValue(created);

            const result = await service.createQuestion({
                cycleId: 50,
                questionTemplateId: 7,
            } as any);

            expect(result).toBe(created);
            const passedDomain = questions.create.mock.calls[0][0];
            expect(passedDomain.title).toBe('Template title');
            expect(passedDomain.answerType).toBe(AnswerType.TEXT_FIELD);
            expect(passedDomain.competenceId).toBe(3);
            expect(passedDomain.isForSelfassessment).toBe(true);
        });

        it('throws when neither payload nor template provide a title or answer type', async () => {
            await expect(
                service.createQuestion({} as any),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('deleteQuestion', () => {
        it('throws NotFoundException when the question does not exist', async () => {
            questions.findById.mockResolvedValue(null);
            await expect(service.deleteQuestion(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('rejects deletion when the cycle is not NEW/ACTIVE', async () => {
            questions.findById.mockResolvedValue(
                QuestionDomain.create({
                    id: 1,
                    cycleId: 50,
                    title: 'Q',
                    answerType: AnswerType.NUMERICAL_SCALE,
                }),
            );
            cycles.getById.mockResolvedValue({
                id: 50,
                stage: CycleStage.FINISHED,
            });
            await expect(service.deleteQuestion(1)).rejects.toBeInstanceOf(
                BadRequestException,
            );
        });

        it('deletes when the question has no cycle attached', async () => {
            questions.findById.mockResolvedValue(
                QuestionDomain.create({
                    id: 1,
                    title: 'Q',
                    answerType: AnswerType.NUMERICAL_SCALE,
                }),
            );
            await service.deleteQuestion(1);
            expect(questions.deleteById).toHaveBeenCalledWith(1);
        });
    });

    describe('attachQuestion', () => {
        it('rejects when the review is not in NEW stage', async () => {
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.IN_PROGRESS }),
            );
            await expect(
                service.attachQuestion({ reviewId: 1, questionTemplateId: 7 }),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('reuses an existing question snapshot when one already exists', async () => {
            reviews.findById.mockResolvedValue(buildReview());
            const template = QuestionTemplateDomain.create({
                id: 7,
                title: 'Q',
                answerType: AnswerType.NUMERICAL_SCALE,
                competenceId: 3,
                isForSelfassessment: false,
            });
            questionTemplates.getById.mockResolvedValue(template);
            competences.getById.mockResolvedValue(
                CompetenceDomain.create({
                    id: 3,
                    title: 'C',
                    code: 'C',
                    description: 'desc',
                }),
            );
            const existing = QuestionDomain.create({
                id: 9,
                cycleId: 50,
                questionTemplateId: 7,
                title: 'Q',
                answerType: AnswerType.NUMERICAL_SCALE,
                competenceId: 3,
            });
            questions.search.mockResolvedValue([existing]);
            questionRelations.link.mockImplementation(
                async (relation: ReviewQuestionRelationDomain) => relation,
            );

            await service.attachQuestion({
                reviewId: 1,
                questionTemplateId: 7,
            });

            expect(questions.create).not.toHaveBeenCalled();
            const linked = questionRelations.link.mock.calls[0][0];
            expect(linked).toBeInstanceOf(ReviewQuestionRelationDomain);
            expect(linked.questionId).toBe(9);
        });

        it('creates a new question snapshot when none exists', async () => {
            reviews.findById.mockResolvedValue(buildReview());
            const template = QuestionTemplateDomain.create({
                id: 7,
                title: 'Q',
                answerType: AnswerType.NUMERICAL_SCALE,
                competenceId: 3,
                isForSelfassessment: false,
            });
            questionTemplates.getById.mockResolvedValue(template);
            competences.getById.mockResolvedValue(
                CompetenceDomain.create({
                    id: 3,
                    title: 'C',
                    code: 'C',
                    description: 'desc',
                }),
            );
            questions.search.mockResolvedValue([]);
            questions.create.mockImplementation(async (q: QuestionDomain) =>
                QuestionDomain.create({ ...q, id: 42 }),
            );
            questionRelations.link.mockImplementation(
                async (relation: ReviewQuestionRelationDomain) => relation,
            );

            await service.attachQuestion({
                reviewId: 1,
                questionTemplateId: 7,
            });

            expect(questions.create).toHaveBeenCalledTimes(1);
            const linked = questionRelations.link.mock.calls[0][0];
            expect(linked.questionId).toBe(42);
        });
    });

    describe('detachQuestion', () => {
        it('rejects detaching when the review has started', async () => {
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.IN_PROGRESS }),
            );
            await expect(service.detachQuestion(1, 5)).rejects.toBeInstanceOf(
                BadRequestException,
            );
        });

        it('unlinks the relation when the review is NEW', async () => {
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.NEW }),
            );
            await service.detachQuestion(1, 5);
            expect(questionRelations.unlink).toHaveBeenCalledWith(1, 5);
        });
    });

    describe('addAnswer', () => {
        it('rejects adding an answer when the review is not in progress', async () => {
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.NEW }),
            );
            const actor = buildUser();
            await expect(
                service.addAnswer(
                    {
                        reviewId: 1,
                        questionId: 1,
                        respondentCategory: RespondentCategory.TEAM,
                        answerType: AnswerType.NUMERICAL_SCALE,
                        numericalValue: 5,
                    },
                    actor,
                ),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('persists the answer when the review is IN_PROGRESS', async () => {
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.IN_PROGRESS }),
            );
            answers.create.mockImplementation(async (a: any) => ({
                ...a,
                id: 99,
            }));

            const actor = buildUser();
            await service.addAnswer(
                {
                    reviewId: 1,
                    questionId: 2,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    numericalValue: 4,
                },
                actor,
            );

            expect(answers.create).toHaveBeenCalledTimes(1);
            const created = answers.create.mock.calls[0][0];
            expect(created.reviewId).toBe(1);
            expect(created.numericalValue).toBe(4);
        });
    });

    describe('listAnswers', () => {
        it('returns answers filtered by respondent category', async () => {
            const review = buildReview();
            reviews.findById.mockResolvedValue(review);
            answers.list.mockResolvedValue([{ id: 1 }]);

            const actor = buildUser({ roles: [IdentityRole.HR] });
            const out = await service.listAnswers(
                1,
                RespondentCategory.TEAM,
                actor,
            );

            expect(answers.list).toHaveBeenCalledWith({
                reviewId: 1,
                respondentCategory: RespondentCategory.TEAM,
            });
            expect(out).toEqual([{ id: 1 }]);
        });
    });

    describe('countReviewAnswers', () => {
        it('sums the answers count per respondent category', async () => {
            const review = buildReview();
            reviews.findById.mockResolvedValue(review);
            answers.getAnswersCountByRespondentCategories.mockResolvedValue([
                { answers: 3 },
                { answers: 2 },
            ]);

            const actor = buildUser({ roles: [IdentityRole.HR] });
            const count = await service.countReviewAnswers(1, actor);

            expect(count).toBe(5);
        });
    });

    describe('addRespondent', () => {
        it('rejects adding to a review in FINISHED stage', async () => {
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.FINISHED }),
            );
            await expect(
                service.addRespondent({
                    reviewId: 1,
                    respondentId: 100,
                    fullName: 'John Doe',
                    category: RespondentCategory.TEAM,
                    responseStatus: ResponseStatus.PENDING,
                    positionId: 1,
                    positionTitle: 'Engineer',
                } as any),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('persists the respondent for an in-progress review', async () => {
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.IN_PROGRESS }),
            );
            respondents.create.mockImplementation(
                async (r: RespondentDomain) => r,
            );

            await service.addRespondent({
                reviewId: 1,
                respondentId: 100,
                fullName: 'John Doe',
                category: RespondentCategory.TEAM,
                responseStatus: ResponseStatus.PENDING,
                positionId: 1,
                positionTitle: 'Engineer',
            } as any);

            expect(respondents.create).toHaveBeenCalledTimes(1);
            const passed = respondents.create.mock.calls[0][0];
            expect(passed).toBeInstanceOf(RespondentDomain);
            expect(passed.fullName).toBe('John Doe');
        });
    });

    describe('updateRespondent', () => {
        it('forbids non-admin actors that are not the respondent themselves', async () => {
            respondents.getById.mockResolvedValue(
                buildRespondent({ respondentId: 999 }),
            );
            const actor = buildUser({
                id: 200,
                roles: [IdentityRole.EMPLOYEE],
            });

            await expect(
                service.updateRespondent(1, { hrNote: 'x' } as any, actor),
            ).rejects.toBeInstanceOf(ForbiddenException);
        });

        it('rejects when the underlying review is not in an in-progress stage', async () => {
            respondents.getById.mockResolvedValue(
                buildRespondent({ respondentId: 200 }),
            );
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.NEW }),
            );
            const actor = buildUser({
                id: 200,
                roles: [IdentityRole.EMPLOYEE],
            });

            await expect(
                service.updateRespondent(1, { hrNote: 'x' } as any, actor),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('updates fields and triggers a status transition when responseStatus is patched', async () => {
            respondents.getById.mockResolvedValue(
                buildRespondent({
                    id: 1,
                    reviewId: 1,
                    respondentId: 200,
                    responseStatus: ResponseStatus.PENDING,
                }),
            );
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.IN_PROGRESS }),
            );
            respondents.updateById.mockResolvedValue(buildRespondent());

            const actor = buildUser({
                id: 200,
                roles: [IdentityRole.EMPLOYEE],
            });

            await service.updateRespondent(
                1,
                { responseStatus: ResponseStatus.IN_PROGRESS } as any,
                actor,
            );

            // Two calls: 1) initial patch with responseStatus stripped, 2) inside changeRespondentStatus
            expect(respondents.updateById).toHaveBeenCalledTimes(2);
            expect(respondents.updateById).toHaveBeenLastCalledWith(1, {
                responseStatus: ResponseStatus.IN_PROGRESS,
            });
            expect(eventEmitter.emit).toHaveBeenCalledWith(
                'respondent.status.changed',
                expect.objectContaining({
                    reviewId: 1,
                    respondentRelationId: 1,
                    fromStatus: ResponseStatus.PENDING,
                    toStatus: ResponseStatus.IN_PROGRESS,
                }),
            );
        });
    });

    describe('changeRespondentStatus', () => {
        it('rejects when respondent does not belong to the review', async () => {
            reviews.findById.mockResolvedValue(buildReview({ id: 1 }));
            respondents.getById.mockResolvedValue(
                buildRespondent({ id: 7, reviewId: 99 }),
            );

            await expect(
                service.changeRespondentStatus(
                    1,
                    7,
                    ResponseStatus.IN_PROGRESS,
                ),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('rejects an invalid transition', async () => {
            reviews.findById.mockResolvedValue(buildReview({ id: 1 }));
            respondents.getById.mockResolvedValue(
                buildRespondent({
                    id: 7,
                    reviewId: 1,
                    responseStatus: ResponseStatus.COMPLETED,
                }),
            );

            await expect(
                service.changeRespondentStatus(
                    1,
                    7,
                    ResponseStatus.IN_PROGRESS,
                ),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('updates the status and emits the event for a valid transition', async () => {
            reviews.findById.mockResolvedValue(buildReview({ id: 1 }));
            respondents.getById.mockResolvedValue(
                buildRespondent({
                    id: 7,
                    reviewId: 1,
                    responseStatus: ResponseStatus.PENDING,
                }),
            );

            await service.changeRespondentStatus(
                1,
                7,
                ResponseStatus.IN_PROGRESS,
                42,
                'Actor',
                'reason',
            );

            expect(respondents.updateById).toHaveBeenCalledWith(7, {
                responseStatus: ResponseStatus.IN_PROGRESS,
            });
            const event = eventEmitter.emit.mock.calls[0][1];
            expect(event.reviewId).toBe(1);
            expect(event.respondentRelationId).toBe(7);
            expect(event.fromStatus).toBe(ResponseStatus.PENDING);
            expect(event.toStatus).toBe(ResponseStatus.IN_PROGRESS);
            expect(event.changedById).toBe(42);
            expect(event.changedByName).toBe('Actor');
            expect(event.reason).toBe('reason');
        });
    });

    describe('listRespondents', () => {
        it('delegates to the respondents repository', async () => {
            reviews.findById.mockResolvedValue(buildReview());
            respondents.listByReview.mockResolvedValue([buildRespondent()]);
            const actor = buildUser({ roles: [IdentityRole.HR] });

            await service.listRespondents(1, {}, actor);

            expect(respondents.listByReview).toHaveBeenCalledWith(1, {});
        });
    });

    describe('removeRespondent', () => {
        it('delegates to the repository', async () => {
            await service.removeRespondent(7);
            expect(respondents.deleteById).toHaveBeenCalledWith(7);
        });
    });

    describe('addReviewer', () => {
        it('verifies the review exists before persisting', async () => {
            reviews.findById.mockResolvedValue(buildReview());
            reviewers.create.mockImplementation(async (r: ReviewerDomain) => r);

            await service.addReviewer({
                reviewId: 1,
                reviewerId: 50,
                fullName: 'Reviewer',
                positionId: 3,
                positionTitle: 'Eng',
            } as any);

            expect(reviewers.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('listReviewers', () => {
        it('delegates to the reviewer repository when actor has access', async () => {
            const review = buildReview();
            reviews.findById.mockResolvedValue(review);
            const actor = buildUser({ roles: [IdentityRole.HR] });
            reviewers.listByReview.mockResolvedValue([{ id: 1 }]);

            const result = await service.listReviewers(1, {}, actor);
            expect(reviewers.listByReview).toHaveBeenCalledWith(1, {});
            expect(result).toEqual([{ id: 1 }]);
        });

        it('throws ForbiddenException when the actor has no relation to the review', async () => {
            const review = buildReview();
            reviews.findById.mockResolvedValue(review);
            respondents.listByReview.mockResolvedValue([]);
            reviewers.listByReview.mockResolvedValue([]);
            const actor = buildUser({
                id: 9999,
                roles: [IdentityRole.EMPLOYEE],
            });

            await expect(
                service.listReviewers(1, {}, actor),
            ).rejects.toBeInstanceOf(ForbiddenException);
        });
    });

    describe('removeReviewer', () => {
        it('delegates to the repository', async () => {
            await service.removeReviewer(5);
            expect(reviewers.deleteById).toHaveBeenCalledWith(5);
        });
    });

    describe('upsertClusterScore', () => {
        it('verifies the cycle when cycleId is provided', async () => {
            cycles.getById.mockResolvedValue({ id: 50 });
            clusterScores.upsert.mockImplementation(
                async (s: ClusterScoreDomain) => s,
            );

            await service.upsertClusterScore({
                cycleId: 50,
                clusterId: 2,
                rateeId: 1,
                reviewId: 1,
                score: 4.5,
            } as any);

            expect(cycles.getById).toHaveBeenCalledWith(50);
            expect(clusterScores.upsert).toHaveBeenCalledTimes(1);
        });

        it('defaults answersCount to 1 when missing', async () => {
            clusterScores.upsert.mockImplementation(
                async (s: ClusterScoreDomain) => s,
            );

            const result = await service.upsertClusterScore({
                clusterId: 2,
                rateeId: 1,
                reviewId: 1,
                score: 4.5,
            } as any);

            expect(result.answersCount).toBe(1);
        });
    });

    describe('listClusterScores / getClusterScoreById / getClusterScoreByCycleId / removeClusterScore', () => {
        it('listClusterScores delegates to the repository', async () => {
            clusterScores.list.mockResolvedValue([]);
            await service.listClusterScores({});
            expect(clusterScores.list).toHaveBeenCalledWith({});
        });

        it('getClusterScoreById delegates to the repository', async () => {
            clusterScores.getById.mockResolvedValue({ id: 1 });
            await service.getClusterScoreById(1);
            expect(clusterScores.getById).toHaveBeenCalledWith(1);
        });

        it('getClusterScoreByCycleId delegates to the repository', async () => {
            clusterScores.getByCycleId.mockResolvedValue([]);
            await service.getClusterScoreByCycleId(50);
            expect(clusterScores.getByCycleId).toHaveBeenCalledWith(50);
        });

        it('removeClusterScore delegates to the repository', async () => {
            await service.removeClusterScore(5);
            expect(clusterScores.deleteById).toHaveBeenCalledWith(5);
        });
    });

    describe('changeReviewStage', () => {
        it('rejects an invalid stage transition', async () => {
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.ARCHIVED }),
            );

            await expect(
                service.changeReviewStage(1, ReviewStage.NEW),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('updates the stage, creates a history record, and emits the event', async () => {
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.NEW }),
            );

            await service.changeReviewStage(
                1,
                ReviewStage.SELF_ASSESSMENT,
                10,
                'HR',
                'reason',
            );

            expect(txReviewUpdate).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { stage: ReviewStage.SELF_ASSESSMENT },
            });

            expect(stageHistory.create).toHaveBeenCalledTimes(1);
            const history = stageHistory.create.mock.calls[0][0];
            expect(history.reviewId).toBe(1);
            expect(history.fromStage).toBe(ReviewStage.NEW);
            expect(history.toStage).toBe(ReviewStage.SELF_ASSESSMENT);

            expect(eventEmitter.emit).toHaveBeenCalledWith(
                'review.stage.changed',
                expect.any(ReviewStageChangedEvent),
            );
        });
    });

    describe('completeReview', () => {
        it('moves the review to FINISHED when all responses are completed/canceled', async () => {
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.IN_PROGRESS }),
            );
            respondents.listByReview.mockResolvedValue([
                buildRespondent({ responseStatus: ResponseStatus.COMPLETED }),
                buildRespondent({ responseStatus: ResponseStatus.CANCELED }),
            ]);

            await service.completeReview(1);

            expect(txReviewUpdate).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { stage: ReviewStage.FINISHED },
            });
            const event = eventEmitter.emit.mock.calls[0][1];
            expect(event.reason).toBe(
                REVIEW_TRANSITION_REASONS.ALL_RESPONSES_COLLECTED,
            );
        });

        it('throws when any response is still pending or in progress', async () => {
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.IN_PROGRESS }),
            );
            respondents.listByReview.mockResolvedValue([
                buildRespondent({ responseStatus: ResponseStatus.PENDING }),
            ]);

            await expect(service.completeReview(1)).rejects.toBeInstanceOf(
                BadRequestException,
            );
        });
    });

    describe('forceFinishReview', () => {
        it('runs changeReviewStage with the FORCE_FINISH reason', async () => {
            reviews.findById.mockResolvedValue(
                buildReview({ stage: ReviewStage.IN_PROGRESS }),
            );

            await service.forceFinishReview(1, 7, 'HR Admin');

            const history = stageHistory.create.mock.calls[0][0];
            expect(history.toStage).toBe(ReviewStage.FINISHED);
            expect(history.reason).toBe(REVIEW_TRANSITION_REASONS.FORCE_FINISH);
        });
    });

    describe('getStageHistory (review)', () => {
        it('delegates to the stageHistory repository', async () => {
            stageHistory.findByReviewId.mockResolvedValue([{ id: 1 }]);
            const result = await service.getStageHistory(7);
            expect(stageHistory.findByReviewId).toHaveBeenCalledWith(7);
            expect(result).toEqual([{ id: 1 }]);
        });
    });
});
