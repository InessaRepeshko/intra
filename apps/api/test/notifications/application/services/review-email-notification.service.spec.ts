import {
    IdentityRole,
    IdentityStatus,
    RespondentCategory,
} from '@intra/shared-kernel';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
});

afterEach(() => {
    jest.restoreAllMocks();
});
import { RESPONDENT_REPOSITORY } from 'src/contexts/feedback360/application/ports/respondent.repository.port';
import { REVIEW_REPOSITORY } from 'src/contexts/feedback360/application/ports/review.repository.port';
import { REVIEWER_REPOSITORY } from 'src/contexts/feedback360/application/ports/reviewer.repository.port';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import { RespondentDomain } from 'src/contexts/feedback360/domain/respondent.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { ReviewerDomain } from 'src/contexts/feedback360/domain/reviewer.domain';
import { IDENTITY_USER_REPOSITORY } from 'src/contexts/identity/application/ports/user.repository.port';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { MAILER } from 'src/contexts/notifications/application/ports/mailer.port';
import { NOTIFICATION_LOG_REPOSITORY } from 'src/contexts/notifications/application/ports/notification-log.repository.port';
import { ReviewEmailNotificationService } from 'src/contexts/notifications/application/services/review-email-notification.service';
import { NotificationKind } from 'src/contexts/notifications/domain/notification-kind.enum';
import { NotificationLogDomain } from 'src/contexts/notifications/domain/notification-log.domain';
import { STRATEGIC_REPORT_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report.repository.port';

function buildUser(
    overrides: Partial<Parameters<typeof UserDomain.create>[0]> = {},
): UserDomain {
    return UserDomain.create({
        id: 200,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        status: IdentityStatus.ACTIVE,
        roles: [IdentityRole.EMPLOYEE],
        ...overrides,
    });
}

function buildReview(
    overrides: Partial<Parameters<typeof ReviewDomain.create>[0]> = {},
): ReviewDomain {
    return ReviewDomain.create({
        id: 10,
        rateeId: 200,
        rateeFullName: 'Jane Doe',
        rateePositionId: 1,
        rateePositionTitle: 'Engineer',
        hrId: 7,
        hrFullName: 'HR Admin',
        reportId: 99,
        ...overrides,
    });
}

function buildLog(
    overrides: Partial<Parameters<typeof NotificationLogDomain.create>[0]> = {},
): NotificationLogDomain {
    return NotificationLogDomain.create({
        id: 1,
        kind: NotificationKind.RATEE_SELF_ASSESSMENT,
        recipientUserId: 200,
        recipientEmail: 'jane@example.com',
        ...overrides,
    });
}

describe('ReviewEmailNotificationService', () => {
    let service: ReviewEmailNotificationService;
    let mailer: { sendMail: jest.Mock };
    let notificationLogRepo: any;
    let reviewRepo: any;
    let respondentRepo: any;
    let reviewerRepo: any;
    let userRepo: any;
    let strategicReportRepo: any;
    let cycleService: any;
    let configService: any;

    beforeEach(async () => {
        mailer = { sendMail: jest.fn() };
        notificationLogRepo = {
            findOneForReview: jest.fn(),
            findOneForCycle: jest.fn(),
            findOneForUser: jest.fn(),
            create: jest.fn(),
            markSent: jest.fn(),
            markFailure: jest.fn(),
        };
        reviewRepo = { findById: jest.fn() };
        respondentRepo = { listByReview: jest.fn() };
        reviewerRepo = { listByReview: jest.fn() };
        userRepo = { findById: jest.fn() };
        strategicReportRepo = { findByCycleId: jest.fn() };
        cycleService = { getById: jest.fn() };
        configService = {
            get: jest.fn((key: string) => {
                if (key === 'app.frontendLink') return 'https://intra.test/';
                if (key === 'app.supportEmail') return 'support@intra.test';
                return undefined;
            }),
        };

        const module = await Test.createTestingModule({
            providers: [
                ReviewEmailNotificationService,
                { provide: MAILER, useValue: mailer },
                {
                    provide: NOTIFICATION_LOG_REPOSITORY,
                    useValue: notificationLogRepo,
                },
                { provide: REVIEW_REPOSITORY, useValue: reviewRepo },
                { provide: RESPONDENT_REPOSITORY, useValue: respondentRepo },
                { provide: REVIEWER_REPOSITORY, useValue: reviewerRepo },
                { provide: IDENTITY_USER_REPOSITORY, useValue: userRepo },
                {
                    provide: STRATEGIC_REPORT_REPOSITORY,
                    useValue: strategicReportRepo,
                },
                { provide: CycleService, useValue: cycleService },
                { provide: ConfigService, useValue: configService },
            ],
        }).compile();

        service = module.get(ReviewEmailNotificationService);
    });

    describe('notifyUserWelcome', () => {
        it('returns 0 when the user does not exist', async () => {
            userRepo.findById.mockResolvedValue(null);

            const sent = await service.notifyUserWelcome(200);

            expect(sent).toBe(0);
            expect(mailer.sendMail).not.toHaveBeenCalled();
        });

        it('creates a per-user log, sends the email, and marks it sent', async () => {
            userRepo.findById.mockResolvedValue(buildUser());
            notificationLogRepo.findOneForUser.mockResolvedValue(null);
            notificationLogRepo.create.mockImplementation(
                async (log: NotificationLogDomain) =>
                    NotificationLogDomain.create({ ...log, id: 42 }),
            );

            const sent = await service.notifyUserWelcome(200);

            expect(sent).toBe(1);
            expect(notificationLogRepo.findOneForUser).toHaveBeenCalledWith(
                NotificationKind.USER_WELCOME,
                200,
            );
            expect(notificationLogRepo.create).toHaveBeenCalledTimes(1);
            const created = notificationLogRepo.create.mock.calls[0][0];
            expect(created.reviewId).toBeNull();
            expect(created.cycleId).toBeNull();
            expect(created.kind).toBe(NotificationKind.USER_WELCOME);

            expect(mailer.sendMail).toHaveBeenCalledTimes(1);
            const mailCall = mailer.sendMail.mock.calls[0][0];
            expect(mailCall.to).toBe('jane@example.com');
            expect(mailCall.template).toBe('user-welcome');
            expect(mailCall.context.userFirstName).toBe('Jane');
            expect(mailCall.context.actionUrl).toBe(
                'https://intra.test/dashboard',
            );
            expect(mailCall.context.supportEmail).toBe('support@intra.test');
            expect(mailCall.attachments).toHaveLength(1);
            expect(notificationLogRepo.markSent).toHaveBeenCalledWith(42);
        });

        it('skips dispatch when a sent log already exists for the user', async () => {
            userRepo.findById.mockResolvedValue(buildUser());
            notificationLogRepo.findOneForUser.mockResolvedValue(
                buildLog({
                    kind: NotificationKind.USER_WELCOME,
                    sentAt: new Date('2025-01-01T00:00:00.000Z'),
                }),
            );

            const sent = await service.notifyUserWelcome(200);

            expect(sent).toBe(0);
            expect(notificationLogRepo.create).not.toHaveBeenCalled();
            expect(mailer.sendMail).not.toHaveBeenCalled();
        });

        it('reuses an existing unsent log without creating a new one', async () => {
            userRepo.findById.mockResolvedValue(buildUser());
            const existing = buildLog({
                id: 7,
                kind: NotificationKind.USER_WELCOME,
            });
            notificationLogRepo.findOneForUser.mockResolvedValue(existing);

            const sent = await service.notifyUserWelcome(200);

            expect(sent).toBe(1);
            expect(notificationLogRepo.create).not.toHaveBeenCalled();
            expect(notificationLogRepo.markSent).toHaveBeenCalledWith(7);
        });

        it('marks failure when mailer.sendMail throws', async () => {
            userRepo.findById.mockResolvedValue(buildUser());
            notificationLogRepo.findOneForUser.mockResolvedValue(null);
            notificationLogRepo.create.mockResolvedValue(buildLog({ id: 42 }));
            mailer.sendMail.mockRejectedValue(new Error('SMTP exploded'));

            const sent = await service.notifyUserWelcome(200);

            expect(sent).toBe(0);
            expect(notificationLogRepo.markFailure).toHaveBeenCalledWith(
                42,
                'SMTP exploded',
            );
            expect(notificationLogRepo.markSent).not.toHaveBeenCalled();
        });

        it('skips dispatch when the recipient has no email', async () => {
            userRepo.findById.mockResolvedValue(
                UserDomain.create({
                    id: 200,
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: '',
                }),
            );

            const sent = await service.notifyUserWelcome(200);

            expect(sent).toBe(0);
            expect(notificationLogRepo.findOneForUser).not.toHaveBeenCalled();
        });
    });

    describe('notifyCycleStrategicReportReady', () => {
        it('returns 0 when the HR user is not found', async () => {
            cycleService.getById.mockResolvedValue({
                id: 100,
                title: 'Q1',
                hrId: 7,
            });
            strategicReportRepo.findByCycleId.mockResolvedValue({ id: 99 });
            userRepo.findById.mockResolvedValue(null);

            const sent = await service.notifyCycleStrategicReportReady(100);

            expect(sent).toBe(0);
            expect(mailer.sendMail).not.toHaveBeenCalled();
        });

        it('sends the strategic-report email to HR with the correct action URL', async () => {
            cycleService.getById.mockResolvedValue({
                id: 100,
                title: 'Q1 2025',
                hrId: 7,
            });
            strategicReportRepo.findByCycleId.mockResolvedValue({ id: 99 });
            userRepo.findById.mockResolvedValue(
                buildUser({ id: 7, firstName: 'HR', email: 'hr@intra.test' }),
            );
            notificationLogRepo.findOneForCycle.mockResolvedValue(null);
            notificationLogRepo.create.mockResolvedValue(buildLog({ id: 42 }));

            const sent = await service.notifyCycleStrategicReportReady(100);

            expect(sent).toBe(1);
            expect(notificationLogRepo.findOneForCycle).toHaveBeenCalledWith(
                100,
                NotificationKind.CYCLE_STRATEGIC_REPORT_READY,
                7,
            );
            const created = notificationLogRepo.create.mock.calls[0][0];
            expect(created.cycleId).toBe(100);
            expect(created.reviewId).toBeNull();

            const mailCall = mailer.sendMail.mock.calls[0][0];
            expect(mailCall.subject).toBe('Strategic report ready: Q1 2025');
            expect(mailCall.template).toBe('cycle-strategic-report-ready');
            expect(mailCall.context.cycleTitle).toBe('Q1 2025');
            expect(mailCall.context.actionUrl).toBe(
                'https://intra.test/reporting/strategic-reports/99',
            );
            expect(notificationLogRepo.markSent).toHaveBeenCalledWith(42);
        });
    });

    describe('notifyRateeSelfAssessment', () => {
        it('returns 0 when the review does not exist', async () => {
            reviewRepo.findById.mockResolvedValue(null);

            const sent = await service.notifyRateeSelfAssessment(10);

            expect(sent).toBe(0);
        });

        it('returns 0 when the ratee user does not exist', async () => {
            reviewRepo.findById.mockResolvedValue(buildReview());
            userRepo.findById.mockResolvedValue(null);

            const sent = await service.notifyRateeSelfAssessment(10);

            expect(sent).toBe(0);
        });

        it('sends the self-assessment email scoped to the review', async () => {
            reviewRepo.findById.mockResolvedValue(buildReview());
            userRepo.findById.mockResolvedValue(buildUser());
            notificationLogRepo.findOneForReview.mockResolvedValue(null);
            notificationLogRepo.create.mockResolvedValue(buildLog({ id: 42 }));

            const sent = await service.notifyRateeSelfAssessment(10);

            expect(sent).toBe(1);
            expect(notificationLogRepo.findOneForReview).toHaveBeenCalledWith(
                10,
                NotificationKind.RATEE_SELF_ASSESSMENT,
                200,
            );
            const created = notificationLogRepo.create.mock.calls[0][0];
            expect(created.reviewId).toBe(10);
            expect(created.cycleId).toBeNull();
            const mailCall = mailer.sendMail.mock.calls[0][0];
            expect(mailCall.template).toBe('ratee-self-assessment');
            expect(mailCall.context.actionUrl).toBe(
                'https://intra.test/feedback360/surveys/10',
            );
        });
    });

    describe('notifyRespondents', () => {
        it('returns 0 when the review does not exist', async () => {
            reviewRepo.findById.mockResolvedValue(null);

            const sent = await service.notifyRespondents(10);

            expect(sent).toBe(0);
        });

        it('iterates respondents, skips missing users, and counts successful sends', async () => {
            reviewRepo.findById.mockResolvedValue(buildReview());
            respondentRepo.listByReview.mockResolvedValue([
                RespondentDomain.create({
                    reviewId: 10,
                    respondentId: 201,
                    fullName: 'A B',
                    category: RespondentCategory.TEAM,
                    positionId: 1,
                    positionTitle: 'Engineer',
                }),
                RespondentDomain.create({
                    reviewId: 10,
                    respondentId: 202,
                    fullName: 'C D',
                    category: RespondentCategory.OTHER,
                    positionId: 1,
                    positionTitle: 'Engineer',
                }),
            ]);
            // First respondent: user exists, sends successfully
            // Second respondent: user missing → skipped
            userRepo.findById.mockImplementation(async (id: number) =>
                id === 201
                    ? buildUser({
                          id: 201,
                          firstName: 'A',
                          email: 'a@intra.test',
                      })
                    : null,
            );
            notificationLogRepo.findOneForReview.mockResolvedValue(null);
            notificationLogRepo.create.mockImplementation(
                async (log: NotificationLogDomain) =>
                    NotificationLogDomain.create({ ...log, id: 42 }),
            );

            const sent = await service.notifyRespondents(10);

            expect(sent).toBe(1);
            expect(mailer.sendMail).toHaveBeenCalledTimes(1);
            const mailCall = mailer.sendMail.mock.calls[0][0];
            expect(mailCall.template).toBe('respondent-invitation');
            expect(mailCall.context.respondentFirstName).toBe('A');
            expect(mailCall.context.rateeFullName).toBe('Jane Doe');
            expect(mailCall.context.rateeFirstName).toBe('Jane');
        });
    });

    describe('notifyHrReportReady', () => {
        it('returns 0 when review or HR is missing', async () => {
            reviewRepo.findById.mockResolvedValue(null);
            await expect(service.notifyHrReportReady(10)).resolves.toBe(0);

            reviewRepo.findById.mockResolvedValue(buildReview());
            userRepo.findById.mockResolvedValue(null);
            await expect(service.notifyHrReportReady(10)).resolves.toBe(0);
        });

        it('sends the HR report-ready email with the comments URL', async () => {
            reviewRepo.findById.mockResolvedValue(buildReview());
            userRepo.findById.mockResolvedValue(
                buildUser({ id: 7, firstName: 'HR', email: 'hr@intra.test' }),
            );
            notificationLogRepo.findOneForReview.mockResolvedValue(null);
            notificationLogRepo.create.mockResolvedValue(buildLog({ id: 42 }));

            const sent = await service.notifyHrReportReady(10);

            expect(sent).toBe(1);
            const mailCall = mailer.sendMail.mock.calls[0][0];
            expect(mailCall.template).toBe('hr-report-ready');
            expect(mailCall.context.actionUrl).toBe(
                'https://intra.test/reporting/individual-reports/99/comments',
            );
        });
    });

    describe('notifyReviewers', () => {
        it('returns 0 when the review is missing', async () => {
            reviewRepo.findById.mockResolvedValue(null);
            await expect(service.notifyReviewers(10)).resolves.toBe(0);
        });

        it('iterates reviewers, sends a per-reviewer email, and counts successful sends', async () => {
            reviewRepo.findById.mockResolvedValue(buildReview());
            reviewerRepo.listByReview.mockResolvedValue([
                ReviewerDomain.create({
                    reviewId: 10,
                    reviewerId: 300,
                    fullName: 'Rev One',
                    positionId: 1,
                    positionTitle: 'Manager',
                }),
            ]);
            userRepo.findById.mockResolvedValue(
                buildUser({
                    id: 300,
                    firstName: 'Rev',
                    email: 'rev@intra.test',
                }),
            );
            notificationLogRepo.findOneForReview.mockResolvedValue(null);
            notificationLogRepo.create.mockResolvedValue(buildLog({ id: 42 }));

            const sent = await service.notifyReviewers(10);

            expect(sent).toBe(1);
            const mailCall = mailer.sendMail.mock.calls[0][0];
            expect(mailCall.template).toBe('reviewer-report-ready');
            expect(mailCall.context.reviewerFirstName).toBe('Rev');
            expect(mailCall.context.actionUrl).toBe(
                'https://intra.test/reporting/individual-reports/99',
            );
        });
    });

    describe('URL building', () => {
        it('strips a trailing slash from the frontend base and prepends one to the path', async () => {
            configService.get = jest.fn((key: string) => {
                if (key === 'app.frontendLink')
                    return 'https://intra.test/'; // trailing slash
                if (key === 'app.supportEmail') return 'support@intra.test';
                return undefined;
            });

            userRepo.findById.mockResolvedValue(buildUser());
            notificationLogRepo.findOneForUser.mockResolvedValue(null);
            notificationLogRepo.create.mockResolvedValue(buildLog({ id: 42 }));

            await service.notifyUserWelcome(200);

            const mailCall = mailer.sendMail.mock.calls[0][0];
            expect(mailCall.context.actionUrl).toBe(
                'https://intra.test/dashboard',
            );
        });

        it('falls back to "/" when no frontend link is configured', async () => {
            configService.get = jest.fn(() => undefined);

            userRepo.findById.mockResolvedValue(buildUser());
            notificationLogRepo.findOneForUser.mockResolvedValue(null);
            notificationLogRepo.create.mockResolvedValue(buildLog({ id: 42 }));

            await service.notifyUserWelcome(200);

            const mailCall = mailer.sendMail.mock.calls[0][0];
            expect(mailCall.context.actionUrl).toBe('/dashboard');
        });
    });
});
