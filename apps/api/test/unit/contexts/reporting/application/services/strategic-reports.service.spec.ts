import {
    AnswerType,
    IdentityRole,
    IdentityStatus,
    RespondentCategory,
} from '@intra/shared-kernel';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ANSWER_REPOSITORY } from 'src/contexts/feedback360/application/ports/answer.repository.port';
import { CYCLE_REPOSITORY } from 'src/contexts/feedback360/application/ports/cycle.repository.port';
import { QUESTION_REPOSITORY } from 'src/contexts/feedback360/application/ports/question.repository.port';
import { RESPONDENT_REPOSITORY } from 'src/contexts/feedback360/application/ports/respondent.repository.port';
import { REVIEW_REPOSITORY } from 'src/contexts/feedback360/application/ports/review.repository.port';
import { REVIEWER_REPOSITORY } from 'src/contexts/feedback360/application/ports/reviewer.repository.port';
import { AnswerDomain } from 'src/contexts/feedback360/domain/answer.domain';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { RespondentDomain } from 'src/contexts/feedback360/domain/respondent.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { ReviewerDomain } from 'src/contexts/feedback360/domain/reviewer.domain';
import { IDENTITY_USER_REPOSITORY } from 'src/contexts/identity/application/ports/user.repository.port';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { COMPETENCE_REPOSITORY } from 'src/contexts/library/application/ports/competence.repository.port';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { ORGANISATION_POSITION_REPOSITORY } from 'src/contexts/organisation/application/ports/position.repository.port';
import { ORGANISATION_TEAM_REPOSITORY } from 'src/contexts/organisation/application/ports/team.repository.port';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { TeamDomain } from 'src/contexts/organisation/domain/team.domain';
import { REPORT_ANALYTICS_REPOSITORY } from 'src/contexts/reporting/application/ports/report-analytics.repository.port';
import { REPORT_REPOSITORY } from 'src/contexts/reporting/application/ports/report.repository.port';
import { STRATEGIC_REPORT_ANALYTICS_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report-analytics.repository.port';
import { STRATEGIC_REPORT_INSIGHT_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report-insight.repository.port';
import { STRATEGIC_REPORT_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report.repository.port';
import { StrategicReportingService } from 'src/contexts/reporting/application/services/strategic-reports.service';
import { ReportAnalyticsDomain } from 'src/contexts/reporting/domain/report-analytics.domain';
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';
import { StrategicReportDomain } from 'src/contexts/reporting/domain/strategic-report.domain';

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

function buildStrategicReport(cycleId = 100): StrategicReportDomain {
    return StrategicReportDomain.create({
        id: 1,
        cycleId,
        cycleTitle: 'Q1',
        rateeCount: 0,
        rateeIds: [],
        respondentCount: 0,
        respondentIds: [],
        answerCount: 0,
        reviewerCount: 0,
        reviewerIds: [],
        teamCount: 0,
        teamIds: [],
        positionCount: 0,
        positionIds: [],
        competenceCount: 0,
        competenceIds: [],
        questionCount: 0,
        questionIds: [],
    });
}

function buildReview(
    overrides: Partial<Parameters<typeof ReviewDomain.create>[0]> = {},
): ReviewDomain {
    return ReviewDomain.create({
        id: 10,
        rateeId: 1,
        rateeFullName: 'R',
        rateePositionId: 1,
        rateePositionTitle: 'Eng',
        hrId: 2,
        hrFullName: 'HR',
        cycleId: 100,
        ...overrides,
    });
}

describe('StrategicReportingService', () => {
    let service: StrategicReportingService;
    let strategicReports: any;
    let strategicAnalyticsRepo: any;
    let respondents: any;
    let reviewers: any;
    let answers: any;
    let reviews: any;
    let cyclesRepo: any;
    let reports: any;
    let users: any;
    let teams: any;
    let positions: any;
    let competences: any;
    let questions: any;
    let reportAnalyticsRepo: any;
    let insightsRepo: any;

    beforeEach(async () => {
        strategicReports = {
            search: jest.fn(),
            findById: jest.fn(),
            findByCycleId: jest.fn(),
            create: jest.fn(),
        };
        strategicAnalyticsRepo = { createMany: jest.fn() };
        respondents = { listByReview: jest.fn() };
        reviewers = { listByReview: jest.fn() };
        answers = {
            list: jest.fn(),
            getAnswersCountByRespondentCategories: jest.fn(),
        };
        reviews = { findById: jest.fn(), search: jest.fn() };
        cyclesRepo = { findById: jest.fn() };
        reports = { search: jest.fn() };
        users = { findById: jest.fn() };
        teams = { findById: jest.fn() };
        positions = { findById: jest.fn() };
        competences = { findById: jest.fn() };
        questions = { findById: jest.fn() };
        reportAnalyticsRepo = { findByReportId: jest.fn() };
        insightsRepo = { createMany: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                StrategicReportingService,
                {
                    provide: STRATEGIC_REPORT_REPOSITORY,
                    useValue: strategicReports,
                },
                {
                    provide: STRATEGIC_REPORT_ANALYTICS_REPOSITORY,
                    useValue: strategicAnalyticsRepo,
                },
                { provide: RESPONDENT_REPOSITORY, useValue: respondents },
                { provide: REVIEWER_REPOSITORY, useValue: reviewers },
                { provide: ANSWER_REPOSITORY, useValue: answers },
                { provide: REVIEW_REPOSITORY, useValue: reviews },
                { provide: CYCLE_REPOSITORY, useValue: cyclesRepo },
                { provide: REPORT_REPOSITORY, useValue: reports },
                { provide: IDENTITY_USER_REPOSITORY, useValue: users },
                { provide: ORGANISATION_TEAM_REPOSITORY, useValue: teams },
                {
                    provide: ORGANISATION_POSITION_REPOSITORY,
                    useValue: positions,
                },
                { provide: COMPETENCE_REPOSITORY, useValue: competences },
                { provide: QUESTION_REPOSITORY, useValue: questions },
                {
                    provide: REPORT_ANALYTICS_REPOSITORY,
                    useValue: reportAnalyticsRepo,
                },
                {
                    provide: STRATEGIC_REPORT_INSIGHT_REPOSITORY,
                    useValue: insightsRepo,
                },
            ],
        }).compile();

        service = module.get(StrategicReportingService);
    });

    describe('search', () => {
        it('delegates to the repository when no actor is supplied', async () => {
            strategicReports.search.mockResolvedValue([buildStrategicReport()]);
            const result = await service.search({});
            expect(result).toHaveLength(1);
        });

        it('throws ForbiddenException for non-admin/HR actors', async () => {
            await expect(
                service.search(
                    {},
                    buildUser({ roles: [IdentityRole.EMPLOYEE] }),
                ),
            ).rejects.toBeInstanceOf(ForbiddenException);
        });

        it('returns reports for admin/HR actors', async () => {
            strategicReports.search.mockResolvedValue([]);
            await expect(
                service.search({}, buildUser({ roles: [IdentityRole.HR] })),
            ).resolves.toEqual([]);
        });
    });

    describe('getById', () => {
        it('throws NotFoundException when the report is missing', async () => {
            strategicReports.findById.mockResolvedValue(null);
            await expect(service.getById(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('returns the report for HR actors', async () => {
            const report = buildStrategicReport();
            strategicReports.findById.mockResolvedValue(report);

            const result = await service.getById(
                1,
                buildUser({ roles: [IdentityRole.HR] }),
            );
            expect(result).toBe(report);
        });

        it('throws NotFoundException when the cycle has no reviews', async () => {
            strategicReports.findById.mockResolvedValue(buildStrategicReport());
            reviews.search.mockResolvedValue([]);

            await expect(
                service.getById(
                    1,
                    buildUser({ id: 999, roles: [IdentityRole.EMPLOYEE] }),
                ),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('returns the report when actor manages at least one review in the cycle', async () => {
            const report = buildStrategicReport();
            strategicReports.findById.mockResolvedValue(report);
            reviews.search.mockResolvedValue([buildReview({ managerId: 5 })]);

            const result = await service.getById(
                1,
                buildUser({ id: 5, roles: [IdentityRole.MANAGER] }),
            );
            expect(result).toBe(report);
        });

        it('throws ForbiddenException when actor has no relation to the cycle reviews', async () => {
            strategicReports.findById.mockResolvedValue(buildStrategicReport());
            reviews.search.mockResolvedValue([buildReview({ managerId: 99 })]);

            await expect(
                service.getById(
                    1,
                    buildUser({ id: 5, roles: [IdentityRole.EMPLOYEE] }),
                ),
            ).rejects.toBeInstanceOf(ForbiddenException);
        });
    });

    describe('getByCycleId', () => {
        it('throws NotFoundException when no report exists for the cycle', async () => {
            strategicReports.findByCycleId.mockResolvedValue(null);
            await expect(service.getByCycleId(100)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('returns the report after checking access', async () => {
            const report = buildStrategicReport();
            strategicReports.findByCycleId.mockResolvedValue(report);

            const result = await service.getByCycleId(100);
            expect(result).toBe(report);
        });
    });

    describe('generateStrategicReportForCycle', () => {
        it('throws NotFoundException when the cycle does not exist', async () => {
            cyclesRepo.findById.mockResolvedValue(null);
            await expect(
                service.generateStrategicReportForCycle(100),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('returns the existing strategic report when one already exists', async () => {
            cyclesRepo.findById.mockResolvedValue({ id: 100, title: 'Q1' });
            const existing = buildStrategicReport();
            strategicReports.findByCycleId.mockResolvedValue(existing);

            const result = await service.generateStrategicReportForCycle(100);

            expect(result).toBe(existing);
            expect(strategicReports.create).not.toHaveBeenCalled();
        });

        it('throws NotFoundException when there are no per-review reports', async () => {
            cyclesRepo.findById.mockResolvedValue({ id: 100, title: 'Q1' });
            strategicReports.findByCycleId.mockResolvedValue(null);
            reports.search.mockResolvedValue([]);

            await expect(
                service.generateStrategicReportForCycle(100),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('throws when the freshly created report cannot be re-loaded', async () => {
            cyclesRepo.findById.mockResolvedValue({ id: 100, title: 'Q1' });
            strategicReports.findByCycleId.mockResolvedValue(null);
            reports.search.mockResolvedValue([
                ReportDomain.create({
                    id: 1,
                    reviewId: 10,
                    cycleId: 100,
                    respondentCount: 1,
                    respondentCategories: [RespondentCategory.TEAM],
                    answerCount: 1,
                    analytics: [],
                }),
            ]);
            reviews.findById.mockResolvedValue(null);
            reportAnalyticsRepo.findByReportId.mockResolvedValue([]);
            strategicReports.create.mockResolvedValue(
                StrategicReportDomain.create({
                    id: 42,
                    cycleId: 100,
                    cycleTitle: 'Q1',
                    rateeCount: 0,
                    rateeIds: [],
                    respondentCount: 0,
                    respondentIds: [],
                    answerCount: 0,
                    reviewerCount: 0,
                    reviewerIds: [],
                    teamCount: 0,
                    teamIds: [],
                    positionCount: 0,
                    positionIds: [],
                    competenceCount: 0,
                    competenceIds: [],
                    questionCount: 0,
                    questionIds: [],
                }),
            );
            strategicReports.findById.mockResolvedValue(null);

            await expect(
                service.generateStrategicReportForCycle(100),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('aggregates reviews, ratees, respondents, answers, reviewers, and competences into the report', async () => {
            cyclesRepo.findById.mockResolvedValue({
                id: 100,
                title: 'Q1 2025',
            });
            strategicReports.findByCycleId.mockResolvedValue(null);

            const perReviewReports = [
                ReportDomain.create({
                    id: 1,
                    reviewId: 10,
                    cycleId: 100,
                    respondentCount: 2,
                    respondentCategories: [RespondentCategory.TEAM],
                    answerCount: 4,
                    turnoutPctOfTeam: 80,
                    turnoutPctOfOther: 50,
                    analytics: [],
                }),
            ];
            reports.search.mockResolvedValue(perReviewReports);

            const review = ReviewDomain.create({
                id: 10,
                rateeId: 11,
                rateeFullName: 'Jane Doe',
                rateePositionId: 3,
                rateePositionTitle: 'Engineer',
                hrId: 2,
                hrFullName: 'HR',
                cycleId: 100,
                reportId: 1,
            });
            reviews.findById.mockResolvedValue(review);

            users.findById.mockImplementation(async (id: number) =>
                UserDomain.create({
                    id,
                    firstName: id === 11 ? 'Jane' : 'X',
                    lastName: 'Doe',
                    email: `u${id}@example.com`,
                    status: IdentityStatus.ACTIVE,
                    positionId: 3,
                    teamId: 4,
                    roles: [IdentityRole.EMPLOYEE],
                }),
            );
            respondents.listByReview.mockResolvedValue([
                RespondentDomain.create({
                    reviewId: 10,
                    respondentId: 20,
                    fullName: 'A B',
                    category: RespondentCategory.TEAM,
                    positionId: 3,
                    positionTitle: 'Engineer',
                    teamId: 4,
                }),
                RespondentDomain.create({
                    reviewId: 10,
                    respondentId: 21,
                    fullName: 'C D',
                    category: RespondentCategory.OTHER,
                    positionId: 3,
                    positionTitle: 'Engineer',
                    teamId: 5,
                }),
            ]);
            teams.findById.mockImplementation(async (id: number) =>
                TeamDomain.create({ id, title: `Team ${id}` }),
            );
            positions.findById.mockImplementation(async (id: number) =>
                PositionDomain.create({ id, title: `Position ${id}` }),
            );
            answers.list.mockResolvedValue([
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
            ]);
            answers.getAnswersCountByRespondentCategories.mockResolvedValue([
                {
                    respondentCategory: RespondentCategory.SELF_ASSESSMENT,
                    answers: 1,
                },
                {
                    respondentCategory: RespondentCategory.TEAM,
                    answers: 3,
                },
                {
                    respondentCategory: RespondentCategory.OTHER,
                    answers: 0,
                },
            ]);
            questions.findById.mockImplementation(async (id: number) =>
                QuestionDomain.create({
                    id,
                    title: `Q ${id}`,
                    answerType: AnswerType.NUMERICAL_SCALE,
                    competenceId: 7,
                }),
            );
            competences.findById.mockResolvedValue(
                CompetenceDomain.create({
                    id: 7,
                    title: 'Teamwork',
                }),
            );
            reviewers.listByReview.mockResolvedValue([
                ReviewerDomain.create({
                    reviewId: 10,
                    reviewerId: 40,
                    fullName: 'Rev One',
                    positionId: 3,
                    positionTitle: 'Senior Engineer',
                }),
            ]);
            reportAnalyticsRepo.findByReportId.mockResolvedValue([
                ReportAnalyticsDomain.create({
                    reportId: 1,
                    entityType: 'COMPETENCE' as any,
                    questionId: null,
                    questionTitle: null,
                    competenceId: 7,
                    competenceTitle: 'Teamwork',
                    averageBySelfAssessment: 4,
                    averageByTeam: 3.5,
                    averageByOther: 4,
                    percentageBySelfAssessment: 80,
                    percentageByTeam: 70,
                    percentageByOther: 80,
                    deltaPercentageByTeam: -10,
                    deltaPercentageByOther: 0,
                }),
            ]);
            strategicReports.create.mockImplementation(
                async (r: StrategicReportDomain) =>
                    StrategicReportDomain.create({ ...r, id: 42 }),
            );
            strategicReports.findById.mockImplementation(async (id: number) =>
                StrategicReportDomain.create({
                    id,
                    cycleId: 100,
                    cycleTitle: 'Q1 2025',
                    rateeCount: 1,
                    rateeIds: [11],
                    respondentCount: 2,
                    respondentIds: [20, 21],
                    answerCount: 4,
                    reviewerCount: 1,
                    reviewerIds: [40],
                    teamCount: 2,
                    teamIds: [4, 5],
                    positionCount: 1,
                    positionIds: [3],
                    competenceCount: 1,
                    competenceIds: [7],
                    questionCount: 1,
                    questionIds: [100],
                }),
            );

            const result = await service.generateStrategicReportForCycle(100);

            expect(result.id).toBe(42);
            // The aggregated report was persisted with the collected IDs
            expect(strategicReports.create).toHaveBeenCalledTimes(1);
            const created = strategicReports.create.mock
                .calls[0][0] as StrategicReportDomain;
            expect(created.cycleTitle).toBe('Q1 2025');
            expect(created.rateeIds).toEqual([11]);
            expect(created.respondentIds).toEqual([20, 21]);
            expect(created.reviewerIds).toEqual([40]);
            expect(created.teamIds).toEqual([4, 5]);
            expect(created.positionIds).toEqual([3]);
            expect(created.competenceIds).toEqual([7]);
            expect(created.questionIds).toEqual([100]);
            expect(created.answerCount).toBe(4);
            // SELF_ASSESSMENT > 0 → rateeTurnout is 100
            expect(created.turnoutAvgPctOfRatees!.toNumber()).toBe(100);

            // Strategic competence analytics were persisted
            expect(strategicAnalyticsRepo.createMany).toHaveBeenCalledTimes(1);
            const passedAnalytics =
                strategicAnalyticsRepo.createMany.mock.calls[0][1];
            expect(passedAnalytics).toHaveLength(1);
            expect(passedAnalytics[0].competenceId).toBe(7);

            // Four insight kinds (HIGHEST/LOWEST rating + delta) were persisted
            expect(insightsRepo.createMany).toHaveBeenCalledTimes(1);
            const passedInsights = insightsRepo.createMany.mock.calls[0][1];
            expect(passedInsights).toHaveLength(4);
        });

        it('keeps rateeTurnout at 0 when no self-assessment answer is found for the review', async () => {
            cyclesRepo.findById.mockResolvedValue({ id: 100, title: 'Q1' });
            strategicReports.findByCycleId.mockResolvedValue(null);
            reports.search.mockResolvedValue([
                ReportDomain.create({
                    id: 1,
                    reviewId: 10,
                    cycleId: 100,
                    respondentCount: 0,
                    respondentCategories: [],
                    answerCount: 0,
                    analytics: [],
                }),
            ]);
            reviews.findById.mockResolvedValue(
                ReviewDomain.create({
                    id: 10,
                    rateeId: 11,
                    rateeFullName: 'Jane Doe',
                    rateePositionId: 3,
                    rateePositionTitle: 'Engineer',
                    hrId: 2,
                    hrFullName: 'HR',
                    cycleId: 100,
                    reportId: 1,
                }),
            );
            users.findById.mockResolvedValue(
                UserDomain.create({
                    id: 11,
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'j@example.com',
                }),
            );
            respondents.listByReview.mockResolvedValue([]);
            answers.list.mockResolvedValue([]);
            answers.getAnswersCountByRespondentCategories.mockResolvedValue([]);
            reviewers.listByReview.mockResolvedValue([]);
            reportAnalyticsRepo.findByReportId.mockResolvedValue([]);
            strategicReports.create.mockImplementation(
                async (r: StrategicReportDomain) =>
                    StrategicReportDomain.create({ ...r, id: 50 }),
            );
            strategicReports.findById.mockResolvedValue(
                StrategicReportDomain.create({
                    id: 50,
                    cycleId: 100,
                    cycleTitle: 'Q1',
                    rateeCount: 1,
                    rateeIds: [11],
                    respondentCount: 0,
                    respondentIds: [],
                    answerCount: 0,
                    reviewerCount: 0,
                    reviewerIds: [],
                    teamCount: 0,
                    teamIds: [],
                    positionCount: 0,
                    positionIds: [],
                    competenceCount: 0,
                    competenceIds: [],
                    questionCount: 0,
                    questionIds: [],
                }),
            );

            const result = await service.generateStrategicReportForCycle(100);

            const created = strategicReports.create.mock
                .calls[0][0] as StrategicReportDomain;
            expect(created.turnoutAvgPctOfRatees!.toNumber()).toBe(0);
            expect(result.id).toBe(50);
        });
    });
});
