import '../../../setup-env';

import {
    AnswerType,
    CommentSentiment,
    IdentityRole,
    RespondentCategory,
    ReviewStage,
} from '@intra/shared-kernel';
import { NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { QuestionRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/question.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { ReportCommentService } from 'src/contexts/reporting/application/services/report-comment.service';
import { ReportCommentDomain } from 'src/contexts/reporting/domain/report-comment.domain';
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';
import { ReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('ReportCommentService (integration)', () => {
    let module: TestingModule;
    let service: ReportCommentService;
    let reportRepo: ReportRepository;
    let reviewRepo: ReviewRepository;
    let cycleRepo: CycleRepository;
    let questionRepo: QuestionRepository;
    let positionRepo: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    let hrId: number;
    let reportId: number;
    let questionId: number;

    beforeAll(async () => {
        module = await createReportingTestModule();
        service = module.get(ReportCommentService);
        reportRepo = module.get(ReportRepository);
        reviewRepo = module.get(ReviewRepository);
        cycleRepo = module.get(CycleRepository);
        questionRepo = module.get(QuestionRepository);
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
        const question = await questionRepo.create(
            QuestionDomain.create({
                cycleId: cycle.id!,
                title: 'Q?',
                answerType: AnswerType.TEXT_FIELD,
            }),
        );
        const report = await reportRepo.create(
            ReportDomain.create({
                reviewId: review.id!,
                cycleId: cycle.id!,
                respondentCount: 3,
                respondentCategories: [RespondentCategory.TEAM],
                answerCount: 6,
                analytics: [],
            }),
        );

        hrId = hr.id!;
        reportId = report.id!;
        questionId = question.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function hrActor(): UserDomain {
        return UserDomain.create({
            id: hrId,
            firstName: 'H',
            lastName: 'R',
            email: 'hr@example.com',
            roles: [IdentityRole.HR],
        });
    }

    function buildComment(
        overrides: Partial<{ comment: string }> = {},
    ): ReportCommentDomain {
        return ReportCommentDomain.create({
            reportId,
            questionId,
            questionTitle: 'Q?',
            comment: overrides.comment ?? 'Great teamwork',
            respondentCategories: [RespondentCategory.TEAM],
            commentSentiment: CommentSentiment.POSITIVE,
            numberOfMentions: 1,
        });
    }

    describe('create', () => {
        it('persists a comment via the repository', async () => {
            const created = await service.create(buildComment());

            expect(created.id).toBeDefined();
            expect(created.comment).toBe('Great teamwork');
        });
    });

    describe('getByReportId', () => {
        it('returns comments tied to a report for an HR actor', async () => {
            await service.create(buildComment());
            await service.create(buildComment({ comment: 'Second' }));

            const result = await service.getByReportId(reportId, hrActor());

            expect(result).toHaveLength(2);
        });

        it('throws NotFoundException when no comments exist for the report', async () => {
            await expect(
                service.getByReportId(reportId, hrActor()),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('delegates report-access check (throws when report is missing)', async () => {
            await expect(
                service.getByReportId(999999, hrActor()),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('getById', () => {
        it('returns the comment when found', async () => {
            const created = await service.create(buildComment());

            const result = await service.getById(created.id!);

            expect(result.id).toBe(created.id);
        });

        it('throws NotFoundException when missing', async () => {
            await expect(service.getById(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });
});
