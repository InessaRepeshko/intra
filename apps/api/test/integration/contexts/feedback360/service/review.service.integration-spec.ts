import '../../../setup-env';

import {
    AnswerType,
    CycleStage,
    IdentityRole,
    RespondentCategory,
    ResponseStatus,
    ReviewStage,
    SYSTEM_ACTOR,
} from '@intra/shared-kernel';
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import { ReviewService } from 'src/contexts/feedback360/application/services/review.service';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import { QuestionTemplateService } from 'src/contexts/library/application/services/question-template.service';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('ReviewService (integration)', () => {
    let module: TestingModule;
    let service: ReviewService;
    let cycles: CycleService;
    let competences: CompetenceService;
    let questionTemplates: QuestionTemplateService;
    let positions: PositionService;
    let identityUsers: IdentityUserService;
    let cycleRepo: CycleRepository;
    let reviewRepo: ReviewRepository;
    let prisma: PrismaService;

    let hrId: number;
    let rateeId: number;
    let positionId: number;
    let cycleId: number;
    let competenceId: number;
    let questionTemplateId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        service = module.get(ReviewService);
        cycles = module.get(CycleService);
        competences = module.get(CompetenceService);
        questionTemplates = module.get(QuestionTemplateService);
        positions = module.get(PositionService);
        identityUsers = module.get(IdentityUserService);
        cycleRepo = module.get(CycleRepository);
        reviewRepo = module.get(ReviewRepository);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetFeedback360Tables(prisma);
        const hr = await identityUsers.create({
            firstName: 'Helena',
            lastName: 'Reed',
            email: `hr.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        const ratee = await identityUsers.create({
            firstName: 'Robert',
            lastName: 'Smith',
            email: `ratee.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        const position = await positions.create({ title: 'Engineer' });
        const cycle = await cycles.create({
            title: 'Cycle',
            hrId: hr.id!,
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-03-31'),
        } as any);
        const competence = await competences.create({ title: 'Teamwork' });
        const template = await questionTemplates.create({
            competenceId: competence.id!,
            title: 'Rate teamwork',
            answerType: AnswerType.NUMERICAL_SCALE,
        } as any);

        hrId = hr.id!;
        rateeId = ratee.id!;
        positionId = position.id!;
        cycleId = cycle.id!;
        competenceId = competence.id!;
        questionTemplateId = template.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function basePayload(
        overrides: Partial<{ cycleId: number | null }> = {},
    ): any {
        return {
            rateeId,
            rateeFullName: 'Robert Smith',
            rateePositionId: positionId,
            rateePositionTitle: 'Engineer',
            hrId,
            hrFullName: 'Helena Reed',
            cycleId:
                overrides.cycleId === undefined ? cycleId : overrides.cycleId,
        };
    }

    async function createReviewAt(stage: ReviewStage): Promise<number> {
        // Insert directly through the repository to bypass stage-machine
        // validation when we want to start at a specific stage.
        const review = await reviewRepo.create(
            ReviewDomain.create({
                ...basePayload(),
                stage,
            } as any),
        );
        return review.id!;
    }

    async function newUserId(seed: string): Promise<number> {
        const user = await identityUsers.create({
            firstName: seed,
            lastName: 'Person',
            email: `${seed}.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        return user.id!;
    }

    describe('create', () => {
        it('persists a review with NEW stage by default', async () => {
            const created = await service.create(basePayload());

            expect(created.id).toBeDefined();
            expect(created.stage).toBe(ReviewStage.NEW);
            expect(created.rateeId).toBe(rateeId);

            const fromDb = await prisma.review.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.rateeFullName).toBe('Robert Smith');
        });

        it('throws NotFoundException when cycleId references a missing cycle', async () => {
            await expect(
                service.create(basePayload({ cycleId: 999999 })),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('search / getById / RBAC', () => {
        it('getById throws NotFoundException for a missing review', async () => {
            await expect(service.getById(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('search without actor returns nothing (no access)', async () => {
            await service.create(basePayload());

            const result = await service.search({} as any);

            expect(result).toEqual([]);
        });

        it('search with HR actor returns all reviews', async () => {
            await service.create(basePayload());
            const hrActor = UserDomain.create({
                id: hrId,
                firstName: 'H',
                lastName: 'R',
                email: 'hr@example.com',
                roles: [IdentityRole.HR],
            });

            const result = await service.search({} as any, hrActor);

            expect(result).toHaveLength(1);
        });

        it('getById with ratee actor succeeds', async () => {
            const review = await service.create(basePayload());
            const rateeActor = UserDomain.create({
                id: rateeId,
                firstName: 'Robert',
                lastName: 'Smith',
                email: 'ratee@example.com',
            });

            await expect(
                service.getById(review.id!, rateeActor),
            ).resolves.toBeDefined();
        });

        it('getById with an unrelated actor throws ForbiddenException', async () => {
            const review = await service.create(basePayload());
            const otherUserId = await newUserId('Other');
            const otherActor = UserDomain.create({
                id: otherUserId,
                firstName: 'Other',
                lastName: 'Person',
                email: 'other@example.com',
            });

            await expect(
                service.getById(review.id!, otherActor),
            ).rejects.toBeInstanceOf(ForbiddenException);
        });
    });

    describe('update', () => {
        it('persists patched fields when the review is NEW', async () => {
            const review = await service.create(basePayload());
            const hrActor = UserDomain.create({
                id: hrId,
                firstName: 'H',
                lastName: 'R',
                email: 'hr@example.com',
                roles: [IdentityRole.HR],
            });

            const updated = await service.update(
                review.id!,
                { hrNote: 'updated' } as any,
                hrActor,
            );

            expect(updated.hrNote).toBe('updated');
        });

        it('rejects updates when the review has progressed past PROCESSING_BY_HR', async () => {
            const reviewId = await createReviewAt(ReviewStage.IN_PROGRESS);
            const hrActor = UserDomain.create({
                id: hrId,
                firstName: 'H',
                lastName: 'R',
                email: 'hr@example.com',
                roles: [IdentityRole.HR],
            });

            await expect(
                service.update(reviewId, { hrNote: 'updated' } as any, hrActor),
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });

    describe('delete', () => {
        it('removes the review row and its dependent rows', async () => {
            const review = await service.create(basePayload());

            await service.delete(review.id!);

            const fromDb = await prisma.review.findUnique({
                where: { id: review.id! },
            });
            expect(fromDb).toBeNull();
        });

        it('rejects deletion when answers are already submitted', async () => {
            const reviewId = await createReviewAt(ReviewStage.IN_PROGRESS);
            const question = await service.createQuestion({
                cycleId,
                title: 'Q?',
                answerType: AnswerType.NUMERICAL_SCALE,
                competenceId,
            } as any);

            await prisma.answer.create({
                data: {
                    reviewId,
                    questionId: question.id!,
                    respondentCategory: 'TEAM' as any,
                    answerType: 'NUMERICAL_SCALE' as any,
                    numericalValue: 4,
                },
            });

            await expect(service.delete(reviewId)).rejects.toBeInstanceOf(
                BadRequestException,
            );
        });
    });

    describe('createQuestion / deleteQuestion', () => {
        it('persists a question without requiring a template', async () => {
            const created = await service.createQuestion({
                cycleId,
                title: 'Open question',
                answerType: AnswerType.TEXT_FIELD,
            } as any);

            expect(created.id).toBeDefined();
            expect(created.title).toBe('Open question');
        });

        it('inherits title / answerType from the template when not specified', async () => {
            const created = await service.createQuestion({
                cycleId,
                questionTemplateId,
            } as any);

            expect(created.title).toBe('Rate teamwork');
            expect(created.answerType).toBe(AnswerType.NUMERICAL_SCALE);
        });

        it('deleteQuestion removes the row when the cycle is still active', async () => {
            const created = await service.createQuestion({
                cycleId,
                title: 'Q',
                answerType: AnswerType.TEXT_FIELD,
            } as any);

            await service.deleteQuestion(created.id!);

            const fromDb = await prisma.question.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });

        it('deleteQuestion rejects when the parent cycle is finished', async () => {
            const created = await service.createQuestion({
                cycleId,
                title: 'Q',
                answerType: AnswerType.TEXT_FIELD,
            } as any);
            // Force the cycle past ACTIVE by writing it directly.
            await cycleRepo.updateById(cycleId, {
                stage: CycleStage.FINISHED,
            } as any);

            await expect(
                service.deleteQuestion(created.id!),
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });

    describe('attachQuestion / detachQuestion / listQuestionRelations', () => {
        it('attaches a question template to a NEW review and creates the relation', async () => {
            const review = await service.create(basePayload());

            const relation = await service.attachQuestion({
                reviewId: review.id!,
                questionTemplateId,
            } as any);

            expect(relation.reviewId).toBe(review.id);
            expect(relation.questionTitle).toBe('Rate teamwork');

            const all = await service.listQuestionRelations(
                review.id!,
                {} as any,
            );
            expect(all).toHaveLength(1);
        });

        it('rejects attaching a question once the review has started', async () => {
            const reviewId = await createReviewAt(ReviewStage.IN_PROGRESS);

            await expect(
                service.attachQuestion({
                    reviewId,
                    questionTemplateId,
                } as any),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('detachQuestion removes the relation while the review is NEW', async () => {
            const review = await service.create(basePayload());
            const relation = await service.attachQuestion({
                reviewId: review.id!,
                questionTemplateId,
            } as any);

            await service.detachQuestion(review.id!, relation.questionId);

            const remaining = await service.listQuestionRelations(
                review.id!,
                {} as any,
            );
            expect(remaining).toEqual([]);
        });
    });

    describe('addRespondent / changeRespondentStatus / completeReview', () => {
        async function addNewRespondent(
            reviewId: number,
            respondentUserId: number,
            fullName: string,
        ) {
            return service.addRespondent({
                reviewId,
                respondentId: respondentUserId,
                fullName,
                category: RespondentCategory.TEAM,
                responseStatus: ResponseStatus.PENDING,
                positionId,
                positionTitle: 'Engineer',
            } as any);
        }

        it('persists a respondent and the row appears in listRespondents', async () => {
            const review = await service.create(basePayload());
            const userId = await newUserId('Sara');

            await addNewRespondent(review.id!, userId, 'Sara Lopez');

            const all = await service.listRespondents(
                review.id!,
                {} as any,
                UserDomain.create({
                    id: hrId,
                    firstName: 'H',
                    lastName: 'R',
                    email: 'hr@example.com',
                    roles: [IdentityRole.HR],
                }),
            );
            expect(all).toHaveLength(1);
            expect(all[0].fullName).toBe('Sara Lopez');
        });

        it('rejects adding a respondent when the review is finished', async () => {
            const reviewId = await createReviewAt(ReviewStage.FINISHED);
            const userId = await newUserId('Sara');

            await expect(
                addNewRespondent(reviewId, userId, 'Sara Lopez'),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('changeRespondentStatus validates the transition', async () => {
            const reviewId = await createReviewAt(ReviewStage.IN_PROGRESS);
            const userId = await newUserId('Sara');
            const respondent = await addNewRespondent(
                reviewId,
                userId,
                'Sara Lopez',
            );

            await expect(
                service.changeRespondentStatus(
                    reviewId,
                    respondent.id!,
                    ResponseStatus.COMPLETED,
                ),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('completeReview transitions IN_PROGRESS → FINISHED when all respondents are COMPLETED', async () => {
            const reviewId = await createReviewAt(ReviewStage.IN_PROGRESS);
            const userId = await newUserId('Sara');
            const respondent = await addNewRespondent(
                reviewId,
                userId,
                'Sara Lopez',
            );

            await service.changeRespondentStatus(
                reviewId,
                respondent.id!,
                ResponseStatus.IN_PROGRESS,
            );
            await service.changeRespondentStatus(
                reviewId,
                respondent.id!,
                ResponseStatus.COMPLETED,
            );

            await service.completeReview(reviewId);

            const reloaded = await service.getById(reviewId);
            expect(reloaded.stage).toBe(ReviewStage.FINISHED);
        });

        it('completeReview rejects when at least one respondent is still PENDING', async () => {
            const reviewId = await createReviewAt(ReviewStage.IN_PROGRESS);
            const userId = await newUserId('Sara');
            await addNewRespondent(reviewId, userId, 'Sara Lopez');

            await expect(
                service.completeReview(reviewId),
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });

    describe('addReviewer / removeReviewer', () => {
        it('persists a reviewer row attached to the review', async () => {
            const review = await service.create(basePayload());
            const userId = await newUserId('Reviewer');

            const reviewer = await service.addReviewer({
                reviewId: review.id!,
                reviewerId: userId,
                fullName: 'Reviewer Person',
                positionId,
                positionTitle: 'Engineer',
            } as any);

            expect(reviewer.id).toBeDefined();
            const fromDb = await prisma.reviewer.findMany({
                where: { reviewId: review.id! },
            });
            expect(fromDb).toHaveLength(1);
        });

        it('removeReviewer drops the row', async () => {
            const review = await service.create(basePayload());
            const userId = await newUserId('Reviewer');
            const reviewer = await service.addReviewer({
                reviewId: review.id!,
                reviewerId: userId,
                fullName: 'Reviewer Person',
                positionId,
                positionTitle: 'Engineer',
            } as any);

            await service.removeReviewer(reviewer.id!);

            const remaining = await prisma.reviewer.findMany({
                where: { reviewId: review.id! },
            });
            expect(remaining).toEqual([]);
        });
    });

    describe('addAnswer', () => {
        it('persists an answer when the review is IN_PROGRESS', async () => {
            const reviewId = await createReviewAt(ReviewStage.IN_PROGRESS);
            const question = await service.createQuestion({
                cycleId,
                title: 'Q?',
                answerType: AnswerType.NUMERICAL_SCALE,
            } as any);
            const hrActor = UserDomain.create({
                id: hrId,
                firstName: 'H',
                lastName: 'R',
                email: 'hr@example.com',
                roles: [IdentityRole.HR],
            });

            const answer = await service.addAnswer(
                {
                    reviewId,
                    questionId: question.id!,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    numericalValue: 4,
                } as any,
                hrActor,
            );

            expect(answer.id).toBeDefined();
            expect(answer.numericalValue).toBe(4);
        });

        it('rejects answers when the review is still NEW', async () => {
            const review = await service.create(basePayload());
            const question = await service.createQuestion({
                cycleId,
                title: 'Q?',
                answerType: AnswerType.NUMERICAL_SCALE,
            } as any);
            const hrActor = UserDomain.create({
                id: hrId,
                firstName: 'H',
                lastName: 'R',
                email: 'hr@example.com',
                roles: [IdentityRole.HR],
            });

            await expect(
                service.addAnswer(
                    {
                        reviewId: review.id!,
                        questionId: question.id!,
                        respondentCategory: RespondentCategory.TEAM,
                        answerType: AnswerType.NUMERICAL_SCALE,
                        numericalValue: 4,
                    } as any,
                    hrActor,
                ),
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });

    describe('upsertClusterScore / listClusterScores', () => {
        async function makeCluster() {
            const cluster = await prisma.cluster.create({
                data: {
                    competenceId,
                    lowerBound: 0,
                    upperBound: 5,
                    title: 'Beginner',
                    description: '',
                },
            });
            return cluster.id;
        }

        it('creates and then updates a cluster score for the same (cluster, ratee) pair', async () => {
            const reviewId = await createReviewAt(ReviewStage.FINISHED);
            const clusterId = await makeCluster();

            const first = await service.upsertClusterScore({
                cycleId,
                clusterId,
                rateeId,
                reviewId,
                score: 3.5,
                answersCount: 5,
            } as any);
            const second = await service.upsertClusterScore({
                cycleId,
                clusterId,
                rateeId,
                reviewId,
                score: 4.1,
                answersCount: 6,
            } as any);

            expect(second.id).toBe(first.id);
            expect(second.score.toNumber()).toBe(4.1);

            const all = await service.listClusterScores({
                cycleId,
            } as any);
            expect(all).toHaveLength(1);
        });
    });

    describe('changeReviewStage / getStageHistory / forceFinishReview', () => {
        it('rejects an invalid transition', async () => {
            const review = await service.create(basePayload());

            await expect(
                service.changeReviewStage(review.id!, ReviewStage.PUBLISHED),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('valid transition persists the new stage and writes a history record', async () => {
            const review = await service.create(basePayload());

            await service.changeReviewStage(
                review.id!,
                ReviewStage.SELF_ASSESSMENT,
                SYSTEM_ACTOR.ID,
                SYSTEM_ACTOR.NAME,
                'kicked off',
            );

            const reloaded = await service.getById(review.id!);
            expect(reloaded.stage).toBe(ReviewStage.SELF_ASSESSMENT);

            const history = await service.getStageHistory(review.id!);
            expect(history).toHaveLength(1);
            expect(history[0].toStage).toBe(ReviewStage.SELF_ASSESSMENT);
            expect(history[0].reason).toBe('kicked off');
        });

        it('forceFinishReview moves an IN_PROGRESS review to FINISHED', async () => {
            const reviewId = await createReviewAt(ReviewStage.IN_PROGRESS);

            await service.forceFinishReview(reviewId, hrId, 'Helena Reed');

            const reloaded = await service.getById(reviewId);
            expect(reloaded.stage).toBe(ReviewStage.FINISHED);
        });
    });
});
