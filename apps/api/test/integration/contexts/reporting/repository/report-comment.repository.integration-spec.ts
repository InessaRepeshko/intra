import '../../../setup-env';

import {
    AnswerType,
    CommentSentiment,
    RespondentCategory,
    ReviewStage,
} from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { QuestionRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/question.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { ReportCommentDomain } from 'src/contexts/reporting/domain/report-comment.domain';
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';
import { ReportCommentRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report-comment.repository';
import { ReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('ReportCommentRepository (integration)', () => {
    let module: TestingModule;
    let repo: ReportCommentRepository;
    let reports: ReportRepository;
    let reviews: ReviewRepository;
    let cycles: CycleRepository;
    let questions: QuestionRepository;
    let positions: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let reportId: number;
    let questionId: number;

    beforeAll(async () => {
        module = await createReportingTestModule();
        repo = module.get(ReportCommentRepository);
        reports = module.get(ReportRepository);
        reviews = module.get(ReviewRepository);
        cycles = module.get(CycleRepository);
        questions = module.get(QuestionRepository);
        positions = module.get(PositionRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetReportingTables(prisma);
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
                stage: ReviewStage.FINISHED,
            }),
        );
        const question = await questions.create(
            QuestionDomain.create({
                cycleId: cycle.id!,
                title: 'Q?',
                answerType: AnswerType.TEXT_FIELD,
            }),
        );
        const report = await reports.create(
            ReportDomain.create({
                reviewId: review.id!,
                cycleId: cycle.id!,
                respondentCount: 4,
                respondentCategories: [RespondentCategory.TEAM],
                answerCount: 12,
                analytics: [],
            }),
        );

        reportId = report.id!;
        questionId = question.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function buildComment(
        overrides: Partial<{
            commentSentiment: CommentSentiment | null;
            numberOfMentions: number;
            comment: string;
        }> = {},
    ): ReportCommentDomain {
        return ReportCommentDomain.create({
            reportId,
            questionId,
            questionTitle: 'Q?',
            comment: overrides.comment ?? 'Great teamwork',
            respondentCategories: [
                RespondentCategory.TEAM,
                RespondentCategory.OTHER,
            ],
            commentSentiment:
                overrides.commentSentiment ?? CommentSentiment.POSITIVE,
            numberOfMentions: overrides.numberOfMentions ?? 3,
        });
    }

    describe('create', () => {
        it('persists a comment row', async () => {
            const created = await repo.create(buildComment());

            expect(created.id).toBeDefined();
            expect(created.comment).toBe('Great teamwork');
            expect(created.commentSentiment).toBe(CommentSentiment.POSITIVE);
            expect(created.numberOfMentions).toBe(3);
        });

        it('persists a comment with no sentiment', async () => {
            const created = await repo.create(
                buildComment({ commentSentiment: null }),
            );

            // Prisma column defaults to POSITIVE when sentiment is undefined
            // in the input — the mapper drops null. So we expect the default.
            expect(created.commentSentiment).toBe(CommentSentiment.POSITIVE);
        });
    });

    describe('findByReportId', () => {
        it('returns comments in ascending id order', async () => {
            await repo.create(buildComment({ comment: 'First' }));
            await repo.create(buildComment({ comment: 'Second' }));

            const result = await repo.findByReportId(reportId);

            expect(result.map((c) => c.comment)).toEqual(['First', 'Second']);
        });

        it('returns an empty array when no comments exist', async () => {
            await expect(repo.findByReportId(reportId)).resolves.toEqual([]);
        });
    });

    describe('findById', () => {
        it('returns the comment when found', async () => {
            const created = await repo.create(buildComment());

            await expect(repo.findById(created.id!)).resolves.toBeInstanceOf(
                ReportCommentDomain,
            );
        });

        it('returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });
});
