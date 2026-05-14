import { IdentityRole } from '@intra/shared-kernel';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ANSWER_REPOSITORY } from 'src/contexts/feedback360/application/ports/answer.repository.port';
import { CYCLE_REPOSITORY } from 'src/contexts/feedback360/application/ports/cycle.repository.port';
import { QUESTION_REPOSITORY } from 'src/contexts/feedback360/application/ports/question.repository.port';
import { RESPONDENT_REPOSITORY } from 'src/contexts/feedback360/application/ports/respondent.repository.port';
import { REVIEW_REPOSITORY } from 'src/contexts/feedback360/application/ports/review.repository.port';
import { REVIEWER_REPOSITORY } from 'src/contexts/feedback360/application/ports/reviewer.repository.port';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { IDENTITY_USER_REPOSITORY } from 'src/contexts/identity/application/ports/user.repository.port';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { COMPETENCE_REPOSITORY } from 'src/contexts/library/application/ports/competence.repository.port';
import { ORGANISATION_POSITION_REPOSITORY } from 'src/contexts/organisation/application/ports/position.repository.port';
import { ORGANISATION_TEAM_REPOSITORY } from 'src/contexts/organisation/application/ports/team.repository.port';
import { REPORT_ANALYTICS_REPOSITORY } from 'src/contexts/reporting/application/ports/report-analytics.repository.port';
import { REPORT_REPOSITORY } from 'src/contexts/reporting/application/ports/report.repository.port';
import { STRATEGIC_REPORT_ANALYTICS_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report-analytics.repository.port';
import { STRATEGIC_REPORT_INSIGHT_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report-insight.repository.port';
import { STRATEGIC_REPORT_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report.repository.port';
import { StrategicReportingService } from 'src/contexts/reporting/application/services/strategic-reports.service';
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
                { provide: STRATEGIC_REPORT_REPOSITORY, useValue: strategicReports },
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
                { provide: ORGANISATION_POSITION_REPOSITORY, useValue: positions },
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
            strategicReports.search.mockResolvedValue([
                buildStrategicReport(),
            ]);
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
            reviews.search.mockResolvedValue([
                buildReview({ managerId: 5 }),
            ]);

            const result = await service.getById(
                1,
                buildUser({ id: 5, roles: [IdentityRole.MANAGER] }),
            );
            expect(result).toBe(report);
        });

        it('throws ForbiddenException when actor has no relation to the cycle reviews', async () => {
            strategicReports.findById.mockResolvedValue(buildStrategicReport());
            reviews.search.mockResolvedValue([
                buildReview({ managerId: 99 }),
            ]);

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
    });
});
