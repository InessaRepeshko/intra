import '../../../setup-env';

import {
    AnswerType,
    IdentityRole,
    RespondentCategory,
    ReviewStage,
} from '@intra/shared-kernel';
import { ForbiddenException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { AnswerDomain } from 'src/contexts/feedback360/domain/answer.domain';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { ReviewQuestionRelationDomain } from 'src/contexts/feedback360/domain/review-question-relation.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { AnswerRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/answer.repository';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { QuestionRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/question.repository';
import { ReviewQuestionRelationRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review-question-relation.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { TextAnswerService } from 'src/contexts/reporting/application/services/text-answer.service';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('TextAnswerService (integration)', () => {
    let module: TestingModule;
    let service: TextAnswerService;
    let cycleRepo: CycleRepository;
    let reviewRepo: ReviewRepository;
    let questionRepo: QuestionRepository;
    let answerRepo: AnswerRepository;
    let relationRepo: ReviewQuestionRelationRepository;
    let competenceRepo: CompetenceRepository;
    let positionRepo: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    let reviewId: number;
    let textQuestionId: number;
    let numericalQuestionId: number;

    beforeAll(async () => {
        module = await createReportingTestModule();
        service = module.get(TextAnswerService);
        cycleRepo = module.get(CycleRepository);
        reviewRepo = module.get(ReviewRepository);
        questionRepo = module.get(QuestionRepository);
        answerRepo = module.get(AnswerRepository);
        relationRepo = module.get(ReviewQuestionRelationRepository);
        competenceRepo = module.get(CompetenceRepository);
        positionRepo = module.get(PositionRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetReportingTables(prisma);
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
        const position = await positionRepo.create(
            PositionDomain.create({ title: 'Engineer' }),
        );
        const cycle = await cycleRepo.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hr.id!,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );
        const review = await reviewRepo.create(
            ReviewDomain.create({
                rateeId: ratee.id!,
                rateeFullName: 'Robert Smith',
                rateePositionId: position.id!,
                rateePositionTitle: 'Engineer',
                hrId: hr.id!,
                hrFullName: 'Helena Reed',
                cycleId: cycle.id!,
                stage: ReviewStage.FINISHED,
            }),
        );
        const competence = await competenceRepo.create(
            CompetenceDomain.create({ title: 'Teamwork' }),
        );
        const textQuestion = await questionRepo.create(
            QuestionDomain.create({
                cycleId: cycle.id!,
                title: 'Free-form feedback',
                answerType: AnswerType.TEXT_FIELD,
                competenceId: competence.id!,
            }),
        );
        const numericalQuestion = await questionRepo.create(
            QuestionDomain.create({
                cycleId: cycle.id!,
                title: 'Rate teamwork',
                answerType: AnswerType.NUMERICAL_SCALE,
                competenceId: competence.id!,
            }),
        );
        // Relations supply the questionTitle the service maps back onto.
        await relationRepo.link(
            ReviewQuestionRelationDomain.create({
                reviewId: review.id!,
                questionId: textQuestion.id!,
                questionTitle: 'Free-form feedback',
                answerType: AnswerType.TEXT_FIELD,
                competenceId: competence.id!,
                competenceTitle: 'Teamwork',
            }),
        );

        reviewId = review.id!;
        textQuestionId = textQuestion.id!;
        numericalQuestionId = numericalQuestion.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    async function seedAnswer(
        questionId: number,
        respondentCategory: RespondentCategory,
        answerType: AnswerType,
        textValue: string | null,
        numericalValue: number | null = null,
    ) {
        await answerRepo.create(
            AnswerDomain.create({
                reviewId,
                questionId,
                respondentCategory,
                answerType,
                textValue,
                numericalValue,
            }),
        );
    }

    function hrActor(): UserDomain {
        return UserDomain.create({
            id: 999,
            firstName: 'H',
            lastName: 'R',
            email: 'hr@example.com',
            roles: [IdentityRole.HR],
        });
    }

    function adminActor(): UserDomain {
        return UserDomain.create({
            id: 1,
            firstName: 'A',
            lastName: 'D',
            email: 'admin@example.com',
            roles: [IdentityRole.ADMIN],
        });
    }

    describe('listByReview', () => {
        it('returns text answers with the question title mapped from relations (HR actor)', async () => {
            await seedAnswer(
                textQuestionId,
                RespondentCategory.TEAM,
                AnswerType.TEXT_FIELD,
                'Great team player',
            );

            const result = await service.listByReview(reviewId, hrActor());

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                questionId: textQuestionId,
                questionTitle: 'Free-form feedback',
                respondentCategory: RespondentCategory.TEAM,
                textValue: 'Great team player',
            });
        });

        it('also allows ADMIN actors', async () => {
            await seedAnswer(
                textQuestionId,
                RespondentCategory.OTHER,
                AnswerType.TEXT_FIELD,
                'Good listener',
            );

            const result = await service.listByReview(reviewId, adminActor());
            expect(result).toHaveLength(1);
        });

        it('allows callers without an actor (system caller)', async () => {
            await seedAnswer(
                textQuestionId,
                RespondentCategory.TEAM,
                AnswerType.TEXT_FIELD,
                'system-readable',
            );

            const result = await service.listByReview(reviewId);
            expect(result).toHaveLength(1);
        });

        it('throws ForbiddenException for a non-HR / non-Admin actor', async () => {
            const employee = UserDomain.create({
                id: 5,
                firstName: 'E',
                lastName: 'M',
                email: 'e@example.com',
                roles: [IdentityRole.EMPLOYEE],
            });

            await expect(
                service.listByReview(reviewId, employee),
            ).rejects.toBeInstanceOf(ForbiddenException);
        });

        it('filters out numerical answers and answers with empty/whitespace text', async () => {
            // Numerical: should be excluded by the answerType filter at
            // the repository level.
            await seedAnswer(
                numericalQuestionId,
                RespondentCategory.TEAM,
                AnswerType.NUMERICAL_SCALE,
                null,
                4,
            );
            // Empty string + whitespace-only: filtered out in the service.
            await seedAnswer(
                textQuestionId,
                RespondentCategory.TEAM,
                AnswerType.TEXT_FIELD,
                '',
            );
            await seedAnswer(
                textQuestionId,
                RespondentCategory.OTHER,
                AnswerType.TEXT_FIELD,
                '   ',
            );
            await seedAnswer(
                textQuestionId,
                RespondentCategory.OTHER,
                AnswerType.TEXT_FIELD,
                'Real feedback',
            );

            const result = await service.listByReview(reviewId, hrActor());

            expect(result).toHaveLength(1);
            expect(result[0].textValue).toBe('Real feedback');
        });

        it('returns null for questionTitle when no relation exists for the question', async () => {
            // Create an answer for a question that is NOT linked via
            // a review-question relation.
            await seedAnswer(
                numericalQuestionId,
                RespondentCategory.OTHER,
                AnswerType.TEXT_FIELD,
                'Untitled answer',
            );

            const result = await service.listByReview(reviewId, hrActor());

            expect(result).toHaveLength(1);
            expect(result[0].questionTitle).toBeNull();
            expect(result[0].questionId).toBe(numericalQuestionId);
        });
    });
});
