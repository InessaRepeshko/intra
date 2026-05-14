import {
    AnswerType,
    IdentityRole,
    RespondentCategory,
} from '@intra/shared-kernel';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ANSWER_REPOSITORY } from 'src/contexts/feedback360/application/ports/answer.repository.port';
import { CLUSTER_SCORE_REPOSITORY } from 'src/contexts/feedback360/application/ports/cluster-score.repository.port';
import { CYCLE_REPOSITORY } from 'src/contexts/feedback360/application/ports/cycle.repository.port';
import { RESPONDENT_REPOSITORY } from 'src/contexts/feedback360/application/ports/respondent.repository.port';
import { REVIEW_QUESTION_RELATION_REPOSITORY } from 'src/contexts/feedback360/application/ports/review-question-relation.repository.port';
import { REVIEW_REPOSITORY } from 'src/contexts/feedback360/application/ports/review.repository.port';
import { REVIEWER_REPOSITORY } from 'src/contexts/feedback360/application/ports/reviewer.repository.port';
import { AnswerDomain } from 'src/contexts/feedback360/domain/answer.domain';
import { RespondentDomain } from 'src/contexts/feedback360/domain/respondent.domain';
import { ReviewQuestionRelationDomain } from 'src/contexts/feedback360/domain/review-question-relation.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { CLUSTER_REPOSITORY } from 'src/contexts/library/application/ports/cluster.repository.port';
import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';
import { REPORT_ANALYTICS_REPOSITORY } from 'src/contexts/reporting/application/ports/report-analytics.repository.port';
import { REPORT_COMMENT_REPOSITORY } from 'src/contexts/reporting/application/ports/report-comment.repository.port';
import { REPORT_INSIGHT_REPOSITORY } from 'src/contexts/reporting/application/ports/report-insight.repository.port';
import { REPORT_REPOSITORY } from 'src/contexts/reporting/application/ports/report.repository.port';
import { ReportingService } from 'src/contexts/reporting/application/services/reports.service';
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';

function buildReview(
    overrides: Partial<Parameters<typeof ReviewDomain.create>[0]> = {},
): ReviewDomain {
    return ReviewDomain.create({
        id: 10,
        rateeId: 200,
        rateeFullName: 'Ratee',
        rateePositionId: 1,
        rateePositionTitle: 'Engineer',
        hrId: 2,
        hrFullName: 'HR',
        cycleId: 100,
        ...overrides,
    });
}

function buildUser(
    overrides: Partial<Parameters<typeof UserDomain.create>[0]> = {},
): UserDomain {
    return UserDomain.create({
        id: 5,
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.com',
        roles: [IdentityRole.EMPLOYEE],
        ...overrides,
    });
}

function buildReport(reviewId = 10): ReportDomain {
    return ReportDomain.create({
        id: 1,
        reviewId,
        cycleId: 100,
        respondentCount: 0,
        respondentCategories: [],
        answerCount: 0,
        analytics: [],
    });
}

describe('ReportingService', () => {
    let service: ReportingService;
    let reports: any;
    let analyticsRepo: any;
    let insightsRepo: any;
    let commentsRepo: any;
    let respondents: any;
    let reviewers: any;
    let answers: any;
    let reviewQuestionRelations: any;
    let reviews: any;
    let clusters: any;
    let clusterScores: any;
    let cyclesRepo: any;

    beforeEach(async () => {
        reports = {
            search: jest.fn(),
            findById: jest.fn(),
            findByReviewId: jest.fn(),
            create: jest.fn(),
        };
        analyticsRepo = {
            createMany: jest.fn(),
            findByReportId: jest.fn(),
        };
        insightsRepo = { createMany: jest.fn() };
        commentsRepo = { create: jest.fn() };
        respondents = { listByReview: jest.fn() };
        reviewers = { listByReview: jest.fn() };
        answers = {
            list: jest.fn(),
            getAnswersCountByRespondentCategories: jest.fn(),
        };
        reviewQuestionRelations = { listByReview: jest.fn() };
        reviews = {
            findById: jest.fn(),
            updateById: jest.fn(),
        };
        clusters = { search: jest.fn() };
        clusterScores = { upsert: jest.fn() };
        cyclesRepo = { findById: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                ReportingService,
                { provide: REPORT_REPOSITORY, useValue: reports },
                {
                    provide: REPORT_ANALYTICS_REPOSITORY,
                    useValue: analyticsRepo,
                },
                {
                    provide: REPORT_INSIGHT_REPOSITORY,
                    useValue: insightsRepo,
                },
                {
                    provide: REPORT_COMMENT_REPOSITORY,
                    useValue: commentsRepo,
                },
                { provide: RESPONDENT_REPOSITORY, useValue: respondents },
                { provide: REVIEWER_REPOSITORY, useValue: reviewers },
                { provide: ANSWER_REPOSITORY, useValue: answers },
                {
                    provide: REVIEW_QUESTION_RELATION_REPOSITORY,
                    useValue: reviewQuestionRelations,
                },
                { provide: REVIEW_REPOSITORY, useValue: reviews },
                { provide: CLUSTER_REPOSITORY, useValue: clusters },
                { provide: CLUSTER_SCORE_REPOSITORY, useValue: clusterScores },
                { provide: CYCLE_REPOSITORY, useValue: cyclesRepo },
            ],
        }).compile();

        service = module.get(ReportingService);
    });

    describe('search', () => {
        it('delegates to the repository when no actor is supplied', async () => {
            reports.search.mockResolvedValue([buildReport()]);
            const result = await service.search({});
            expect(result).toHaveLength(1);
            expect(reports.search).toHaveBeenCalledWith({});
        });

        it('throws ForbiddenException for non-admin/HR actors', async () => {
            await expect(
                service.search({}, buildUser({ roles: [IdentityRole.EMPLOYEE] })),
            ).rejects.toBeInstanceOf(ForbiddenException);
        });

        it('allows admin/HR actors', async () => {
            reports.search.mockResolvedValue([]);
            await expect(
                service.search({}, buildUser({ roles: [IdentityRole.HR] })),
            ).resolves.toEqual([]);
        });
    });

    describe('getById', () => {
        it('throws NotFoundException when the report is missing', async () => {
            reports.findById.mockResolvedValue(null);
            await expect(service.getById(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('returns the report for HR actors', async () => {
            const report = buildReport();
            reports.findById.mockResolvedValue(report);

            const result = await service.getById(
                1,
                buildUser({ roles: [IdentityRole.HR] }),
            );
            expect(result).toBe(report);
        });

        it('returns the report when the actor is the ratee', async () => {
            const report = buildReport();
            reports.findById.mockResolvedValue(report);
            reviews.findById.mockResolvedValue(buildReview({ rateeId: 5 }));

            const result = await service.getById(
                1,
                buildUser({ id: 5, roles: [IdentityRole.EMPLOYEE] }),
            );
            expect(result).toBe(report);
        });

        it('returns the report when the actor is a reviewer', async () => {
            const report = buildReport();
            reports.findById.mockResolvedValue(report);
            reviews.findById.mockResolvedValue(buildReview({ rateeId: 200 }));
            reviewers.listByReview.mockResolvedValue([{ id: 1 }]);

            const result = await service.getById(
                1,
                buildUser({ id: 999, roles: [IdentityRole.EMPLOYEE] }),
            );
            expect(result).toBe(report);
        });

        it('throws ForbiddenException when the actor has no relation', async () => {
            const report = buildReport();
            reports.findById.mockResolvedValue(report);
            reviews.findById.mockResolvedValue(buildReview({ rateeId: 200 }));
            reviewers.listByReview.mockResolvedValue([]);

            await expect(
                service.getById(
                    1,
                    buildUser({ id: 999, roles: [IdentityRole.EMPLOYEE] }),
                ),
            ).rejects.toBeInstanceOf(ForbiddenException);
        });

        it('throws NotFoundException when the underlying review is missing', async () => {
            const report = buildReport();
            reports.findById.mockResolvedValue(report);
            reviews.findById.mockResolvedValue(null);

            await expect(
                service.getById(
                    1,
                    buildUser({ id: 999, roles: [IdentityRole.EMPLOYEE] }),
                ),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('getByReviewId', () => {
        it('throws NotFoundException when no report exists for the review', async () => {
            reports.findByReviewId.mockResolvedValue(null);
            await expect(service.getByReviewId(10)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('returns the report after checking access', async () => {
            const report = buildReport();
            reports.findByReviewId.mockResolvedValue(report);

            const result = await service.getByReviewId(10);
            expect(result).toBe(report);
        });
    });

    describe('generateReportForReview', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'test';
        });

        it('returns the existing report when one is already stored', async () => {
            const existing = buildReport();
            reports.findByReviewId.mockResolvedValue(existing);

            const result = await service.generateReportForReview(10);

            expect(result).toBe(existing);
            expect(reports.create).not.toHaveBeenCalled();
        });

        it('throws when the underlying review is missing', async () => {
            reports.findByReviewId.mockResolvedValue(null);
            reviews.findById.mockResolvedValue(null);

            await expect(
                service.generateReportForReview(10),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('generates a report with analytics, insights and updates the review', async () => {
            reports.findByReviewId.mockResolvedValue(null);
            reviews.findById.mockResolvedValue(buildReview());
            respondents.listByReview.mockResolvedValue([
                RespondentDomain.create({
                    reviewId: 10,
                    respondentId: 11,
                    fullName: 'A',
                    category: RespondentCategory.TEAM,
                    positionId: 1,
                    positionTitle: 'Eng',
                }),
            ]);
            answers.getAnswersCountByRespondentCategories.mockResolvedValue([
                { respondentCategory: RespondentCategory.TEAM, answers: 5 },
            ]);
            const review = buildReview();
            const answerRows = [
                AnswerDomain.create({
                    reviewId: 10,
                    questionId: 100,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    numericalValue: 4,
                }),
                AnswerDomain.create({
                    reviewId: 10,
                    questionId: 100,
                    respondentCategory: RespondentCategory.SELF_ASSESSMENT,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    numericalValue: 5,
                }),
            ];
            answers.list.mockResolvedValue(answerRows);
            reviewQuestionRelations.listByReview.mockResolvedValue([
                ReviewQuestionRelationDomain.create({
                    reviewId: 10,
                    questionId: 100,
                    questionTitle: 'Q?',
                    answerType: AnswerType.NUMERICAL_SCALE,
                    competenceId: 7,
                    competenceTitle: 'Teamwork',
                }),
            ]);
            clusters.search.mockResolvedValue([
                ClusterDomain.create({
                    id: 1,
                    competenceId: 7,
                    lowerBound: 0,
                    upperBound: 5,
                    title: 'High',
                    description: 'desc',
                }),
            ]);
            reports.create.mockImplementation(async (r: ReportDomain) =>
                ReportDomain.create({ ...r, id: 42, analytics: [] }),
            );

            const result = await service.generateReportForReview(10);

            expect(result.id).toBe(42);
            // Two analytics rows: 1 question + 1 competence
            expect(analyticsRepo.createMany).toHaveBeenCalledTimes(1);
            const createdAnalytics = analyticsRepo.createMany.mock.calls[0][1];
            expect(createdAnalytics).toHaveLength(2);
            // Four insights: HIGHEST/LOWEST rating + delta per entity type
            const createdInsights = insightsRepo.createMany.mock.calls[0][1];
            expect(createdInsights).toHaveLength(8); // 4 question + 4 competence
            expect(reviews.updateById).toHaveBeenCalledWith(10, {
                reportId: 42,
            });
            // Cluster score upserted because competence has a numerical answer
            expect(clusterScores.upsert).toHaveBeenCalledTimes(1);
        });

        it('throws when only self-assessment answers exist in production mode', async () => {
            // The service caches NODE_ENV at construction time via a private
            // field initializer; flip it directly for this single test.
            (service as any).isProduction = true;

            reports.findByReviewId.mockResolvedValue(null);
            reviews.findById.mockResolvedValue(buildReview());
            respondents.listByReview.mockResolvedValue([]);
            answers.getAnswersCountByRespondentCategories.mockResolvedValue([
                {
                    respondentCategory: RespondentCategory.SELF_ASSESSMENT,
                    answers: 1,
                },
            ]);
            cyclesRepo.findById.mockResolvedValue({
                id: 100,
                minRespondentsThreshold: 3,
            });

            await expect(
                service.generateReportForReview(10),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });
});
