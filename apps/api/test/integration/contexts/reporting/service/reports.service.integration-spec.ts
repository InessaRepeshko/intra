import '../../../setup-env';

import {
    AnswerType,
    IdentityRole,
    RespondentCategory,
    ResponseStatus,
    ReviewStage,
} from '@intra/shared-kernel';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { AnswerDomain } from 'src/contexts/feedback360/domain/answer.domain';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { RespondentDomain } from 'src/contexts/feedback360/domain/respondent.domain';
import { ReviewQuestionRelationDomain } from 'src/contexts/feedback360/domain/review-question-relation.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { AnswerRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/answer.repository';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { QuestionRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/question.repository';
import { RespondentRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/respondent.repository';
import { ReviewQuestionRelationRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review-question-relation.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { ReportingService } from 'src/contexts/reporting/application/services/reports.service';
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';
import { ReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('ReportingService (integration)', () => {
    let module: TestingModule;
    let service: ReportingService;
    let reportRepo: ReportRepository;
    let reviewRepo: ReviewRepository;
    let cycleRepo: CycleRepository;
    let questionRepo: QuestionRepository;
    let relationRepo: ReviewQuestionRelationRepository;
    let answerRepo: AnswerRepository;
    let respondentRepo: RespondentRepository;
    let competenceRepo: CompetenceRepository;
    let positionRepo: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    let hrUser: UserDomain;
    let rateeUser: UserDomain;

    beforeAll(async () => {
        module = await createReportingTestModule();
        service = module.get(ReportingService);
        reportRepo = module.get(ReportRepository);
        reviewRepo = module.get(ReviewRepository);
        cycleRepo = module.get(CycleRepository);
        questionRepo = module.get(QuestionRepository);
        relationRepo = module.get(ReviewQuestionRelationRepository);
        answerRepo = module.get(AnswerRepository);
        respondentRepo = module.get(RespondentRepository);
        competenceRepo = module.get(CompetenceRepository);
        positionRepo = module.get(PositionRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetReportingTables(prisma);
        hrUser = await identityUsers.create({
            firstName: 'Helena',
            lastName: 'Reed',
            email: `hr.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        rateeUser = await identityUsers.create({
            firstName: 'Robert',
            lastName: 'Smith',
            email: `ratee.${Date.now()}.${Math.random()}@example.com`,
        } as any);
    });

    afterAll(async () => {
        await module.close();
    });

    async function seedReview(): Promise<{
        reviewId: number;
        cycleId: number;
    }> {
        const position = await positionRepo.create(
            PositionDomain.create({ title: 'Engineer' }),
        );
        const cycle = await cycleRepo.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hrUser.id!,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );
        const review = await reviewRepo.create(
            ReviewDomain.create({
                rateeId: rateeUser.id!,
                rateeFullName: 'Robert Smith',
                rateePositionId: position.id!,
                rateePositionTitle: 'Engineer',
                hrId: hrUser.id!,
                hrFullName: 'Helena Reed',
                cycleId: cycle.id!,
                stage: ReviewStage.FINISHED,
            }),
        );
        return { reviewId: review.id!, cycleId: cycle.id! };
    }

    async function seedReport(
        reviewId: number,
        cycleId: number,
    ): Promise<number> {
        const report = await reportRepo.create(
            ReportDomain.create({
                reviewId,
                cycleId,
                respondentCount: 3,
                respondentCategories: [
                    RespondentCategory.TEAM,
                    RespondentCategory.OTHER,
                ],
                answerCount: 12,
                analytics: [],
            }),
        );
        return report.id!;
    }

    function hrActor(): UserDomain {
        return UserDomain.create({
            id: hrUser.id,
            firstName: 'H',
            lastName: 'R',
            email: 'hr@example.com',
            roles: [IdentityRole.HR],
        });
    }

    function nonPrivilegedActor(id: number): UserDomain {
        return UserDomain.create({
            id,
            firstName: 'Other',
            lastName: 'Person',
            email: 'other@example.com',
            roles: [IdentityRole.EMPLOYEE],
        });
    }

    describe('search / checkAccessToAllReports', () => {
        it('returns persisted reports for an HR actor', async () => {
            const { reviewId, cycleId } = await seedReview();
            await seedReport(reviewId, cycleId);

            const result = await service.search({} as any, hrActor());

            expect(result).toHaveLength(1);
        });

        it('returns results when no actor is passed (system call)', async () => {
            const { reviewId, cycleId } = await seedReview();
            await seedReport(reviewId, cycleId);

            const result = await service.search({} as any);

            expect(result).toHaveLength(1);
        });

        it('throws ForbiddenException for a non-HR / non-Admin actor', async () => {
            const otherId = (
                await identityUsers.create({
                    firstName: 'Other',
                    lastName: 'P',
                    email: `o.${Date.now()}.${Math.random()}@example.com`,
                } as any)
            ).id!;

            await expect(
                service.search({} as any, nonPrivilegedActor(otherId)),
            ).rejects.toBeInstanceOf(ForbiddenException);
        });
    });

    describe('getById / checkAccessToReport', () => {
        it('returns the report when found and accessor is HR', async () => {
            const { reviewId, cycleId } = await seedReview();
            const reportId = await seedReport(reviewId, cycleId);

            const result = await service.getById(reportId, hrActor());

            expect(result.id).toBe(reportId);
        });

        it('returns the report when accessor is the ratee', async () => {
            const { reviewId, cycleId } = await seedReview();
            const reportId = await seedReport(reviewId, cycleId);
            const rateeActor = UserDomain.create({
                id: rateeUser.id,
                firstName: 'R',
                lastName: 'S',
                email: 'ratee@example.com',
                roles: [IdentityRole.EMPLOYEE],
            });

            await expect(
                service.getById(reportId, rateeActor),
            ).resolves.toBeDefined();
        });

        it('throws ForbiddenException when accessor is unrelated to the review', async () => {
            const { reviewId, cycleId } = await seedReview();
            const reportId = await seedReport(reviewId, cycleId);
            const strangerId = (
                await identityUsers.create({
                    firstName: 'X',
                    lastName: 'Y',
                    email: `x.${Date.now()}.${Math.random()}@example.com`,
                } as any)
            ).id!;

            await expect(
                service.getById(reportId, nonPrivilegedActor(strangerId)),
            ).rejects.toBeInstanceOf(ForbiddenException);
        });

        it('throws NotFoundException for a missing id', async () => {
            await expect(service.getById(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('getByReviewId', () => {
        it('returns the report tied to a review', async () => {
            const { reviewId, cycleId } = await seedReview();
            await seedReport(reviewId, cycleId);

            const result = await service.getByReviewId(reviewId, hrActor());

            expect(result.reviewId).toBe(reviewId);
        });

        it('throws NotFoundException when no report exists for a review', async () => {
            const { reviewId } = await seedReview();

            await expect(
                service.getByReviewId(reviewId, hrActor()),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('generateReportForReview', () => {
        async function seedQuestionAndRelation(
            reviewId: number,
            cycleId: number,
        ): Promise<{ questionId: number; competenceId: number }> {
            const competence = await competenceRepo.create(
                CompetenceDomain.create({ title: 'Teamwork' }),
            );
            const question = await questionRepo.create(
                QuestionDomain.create({
                    cycleId,
                    title: 'Rate teamwork',
                    answerType: AnswerType.NUMERICAL_SCALE,
                    competenceId: competence.id!,
                }),
            );
            await relationRepo.link(
                ReviewQuestionRelationDomain.create({
                    reviewId,
                    questionId: question.id!,
                    questionTitle: 'Rate teamwork',
                    answerType: AnswerType.NUMERICAL_SCALE,
                    competenceId: competence.id!,
                    competenceTitle: 'Teamwork',
                }),
            );
            return { questionId: question.id!, competenceId: competence.id! };
        }

        async function seedRespondentAndAnswer(
            reviewId: number,
            questionId: number,
            positionId: number,
            category: RespondentCategory,
            answerValue: number,
        ) {
            const user = await identityUsers.create({
                firstName: `R${Date.now()}${Math.random()}`,
                lastName: 'Person',
                email: `r.${Date.now()}.${Math.random()}@example.com`,
            } as any);
            await respondentRepo.create(
                RespondentDomain.create({
                    reviewId,
                    respondentId: user.id!,
                    fullName: user.fullName,
                    category,
                    responseStatus: ResponseStatus.COMPLETED,
                    positionId,
                    positionTitle: 'Engineer',
                }),
            );
            await answerRepo.create(
                AnswerDomain.create({
                    reviewId,
                    questionId,
                    respondentCategory: category,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    numericalValue: answerValue,
                }),
            );
        }

        it('creates a report with aggregated analytics for a complete review', async () => {
            const { reviewId, cycleId } = await seedReview();
            const position = (await positionRepo.search({} as any))[0];
            const { questionId } = await seedQuestionAndRelation(
                reviewId,
                cycleId,
            );

            await seedRespondentAndAnswer(
                reviewId,
                questionId,
                position.id!,
                RespondentCategory.TEAM,
                4,
            );
            await seedRespondentAndAnswer(
                reviewId,
                questionId,
                position.id!,
                RespondentCategory.OTHER,
                3,
            );

            const created = await service.generateReportForReview(reviewId);

            expect(created.id).toBeDefined();
            expect(created.respondentCount).toBe(2);
            expect(created.answerCount).toBe(2);
            expect(created.cycleId).toBe(cycleId);

            // Analytics rows should have been written for the question
            // and the competence (one of each at minimum).
            const fromDb = await reportRepo.findById(created.id!);
            expect(fromDb!.analytics.length).toBeGreaterThan(0);

            // The owning review should be linked back to the report.
            const reviewAfter = await reviewRepo.findById(reviewId);
            expect(reviewAfter!.reportId).toBe(created.id);
        });

        it('returns the existing report when one already exists for the review', async () => {
            const { reviewId, cycleId } = await seedReview();
            const existingId = await seedReport(reviewId, cycleId);

            const result = await service.generateReportForReview(reviewId);

            expect(result.id).toBe(existingId);
        });

        it('throws NotFoundException when the review is missing', async () => {
            await expect(
                service.generateReportForReview(999999),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });
});
