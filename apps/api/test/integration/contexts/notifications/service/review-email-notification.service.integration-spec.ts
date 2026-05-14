import '../../../setup-env';

import {
    RespondentCategory,
    ResponseStatus,
    ReviewStage,
} from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { RespondentDomain } from 'src/contexts/feedback360/domain/respondent.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { ReviewerDomain } from 'src/contexts/feedback360/domain/reviewer.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { RespondentRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/respondent.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { ReviewerRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/reviewer.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { UserRepository } from 'src/contexts/identity/infrastructure/prisma-repositories/user.repository';
import { ReviewEmailNotificationService } from 'src/contexts/notifications/application/services/review-email-notification.service';
import { NotificationKind } from 'src/contexts/notifications/domain/notification-kind.enum';
import { NotificationLogRepository } from 'src/contexts/notifications/infrastructure/prisma-repositories/notification-log.repository';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    MailerStub,
    createNotificationsServiceTestModule,
    resetNotificationTables,
} from '../test-app-notifications';

describe('ReviewEmailNotificationService (integration)', () => {
    let module: TestingModule;
    let mailer: MailerStub;
    let service: ReviewEmailNotificationService;
    let cycleRepo: CycleRepository;
    let reviewRepo: ReviewRepository;
    let respondentRepo: RespondentRepository;
    let reviewerRepo: ReviewerRepository;
    let positionRepo: PositionRepository;
    let notificationLogRepo: NotificationLogRepository;
    let identityUsers: IdentityUserService;
    let userRepo: UserRepository;
    let prisma: PrismaService;

    let hrId: number;
    let rateeId: number;
    let positionId: number;

    beforeAll(async () => {
        const built = await createNotificationsServiceTestModule();
        module = built.module;
        mailer = built.mailerStub;
        service = module.get(ReviewEmailNotificationService);
        cycleRepo = module.get(CycleRepository);
        reviewRepo = module.get(ReviewRepository);
        respondentRepo = module.get(RespondentRepository);
        reviewerRepo = module.get(ReviewerRepository);
        positionRepo = module.get(PositionRepository);
        notificationLogRepo = module.get(NotificationLogRepository);
        identityUsers = module.get(IdentityUserService);
        userRepo = module.get(UserRepository);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetNotificationTables(prisma);
        mailer.reset();
        // Seed users via the repo directly (NOT via IdentityUserService)
        // because the latter emits `user.created`, which fires the
        // UserCreatedNotificationListener and pollutes `mailer.calls`
        // before each test's body runs.
        const hr = await userRepo.create(
            UserDomain.create({
                firstName: 'Helena',
                lastName: 'Reed',
                email: `hr.${Date.now()}.${Math.random()}@example.com`,
            }),
        );
        const ratee = await userRepo.create(
            UserDomain.create({
                firstName: 'Robert',
                lastName: 'Smith',
                email: `ratee.${Date.now()}.${Math.random()}@example.com`,
            }),
        );
        const position = await positionRepo.create(
            PositionDomain.create({ title: 'Engineer' }),
        );
        hrId = hr.id!;
        rateeId = ratee.id!;
        positionId = position.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    async function makeCycle(): Promise<number> {
        const cycle = await cycleRepo.create(
            CycleDomain.create({
                title: 'Q1 2026',
                hrId,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );
        return cycle.id!;
    }

    async function makeReview(cycleId: number): Promise<number> {
        const review = await reviewRepo.create(
            ReviewDomain.create({
                rateeId,
                rateeFullName: 'Robert Smith',
                rateePositionId: positionId,
                rateePositionTitle: 'Engineer',
                hrId,
                hrFullName: 'Helena Reed',
                cycleId,
                stage: ReviewStage.NEW,
            }),
        );
        return review.id!;
    }

    describe('notifyUserWelcome', () => {
        it('sends a welcome email and persists a sent NotificationLog row', async () => {
            const sentCount = await service.notifyUserWelcome(rateeId);

            expect(sentCount).toBe(1);
            expect(mailer.calls).toHaveLength(1);
            expect(mailer.calls[0].template).toBe('user-welcome');
            expect(mailer.calls[0].subject).toContain('Welcome');

            const log = await notificationLogRepo.findOneForUser(
                NotificationKind.USER_WELCOME,
                rateeId,
            );
            expect(log).not.toBeNull();
            expect(log!.isSent()).toBe(true);
        });

        it('skips dispatch when the user already has a sent welcome log', async () => {
            await service.notifyUserWelcome(rateeId);
            mailer.reset();

            const sentCount = await service.notifyUserWelcome(rateeId);

            expect(sentCount).toBe(0);
            expect(mailer.calls).toEqual([]);
        });

        it('returns 0 when the user is missing', async () => {
            const sentCount = await service.notifyUserWelcome(999999);

            expect(sentCount).toBe(0);
            expect(mailer.calls).toEqual([]);
        });
    });

    describe('notifyRateeSelfAssessment', () => {
        it('sends one email to the ratee and writes a sent log tied to the review', async () => {
            const cycleId = await makeCycle();
            const reviewId = await makeReview(cycleId);

            const sentCount = await service.notifyRateeSelfAssessment(reviewId);

            expect(sentCount).toBe(1);
            expect(mailer.calls).toHaveLength(1);
            expect(mailer.calls[0].template).toBe('ratee-self-assessment');

            const log = await notificationLogRepo.findOneForReview(
                reviewId,
                NotificationKind.RATEE_SELF_ASSESSMENT,
                rateeId,
            );
            expect(log!.isSent()).toBe(true);
        });

        it('returns 0 when the review is missing', async () => {
            const sentCount = await service.notifyRateeSelfAssessment(999999);

            expect(sentCount).toBe(0);
            expect(mailer.calls).toEqual([]);
        });
    });

    describe('notifyRespondents', () => {
        it('emails every respondent and writes one log row per recipient', async () => {
            const cycleId = await makeCycle();
            const reviewId = await makeReview(cycleId);
            const sara = await userRepo.create(
                UserDomain.create({
                    firstName: 'Sara',
                    lastName: 'Lopez',
                    email: `sara.${Date.now()}.${Math.random()}@example.com`,
                }),
            );
            const ben = await userRepo.create(
                UserDomain.create({
                    firstName: 'Ben',
                    lastName: 'Cole',
                    email: `ben.${Date.now()}.${Math.random()}@example.com`,
                }),
            );
            for (const respondent of [sara, ben]) {
                await respondentRepo.create(
                    RespondentDomain.create({
                        reviewId,
                        respondentId: respondent.id!,
                        fullName: respondent.fullName,
                        category: RespondentCategory.TEAM,
                        responseStatus: ResponseStatus.PENDING,
                        positionId,
                        positionTitle: 'Engineer',
                    }),
                );
            }

            const sentCount = await service.notifyRespondents(reviewId);

            expect(sentCount).toBe(2);
            expect(mailer.calls.map((c) => c.to).sort()).toEqual(
                [sara.email, ben.email].sort(),
            );

            const saraLog = await notificationLogRepo.findOneForReview(
                reviewId,
                NotificationKind.RESPONDENT_INVITATION,
                sara.id!,
            );
            expect(saraLog!.isSent()).toBe(true);
        });

        it('returns 0 when the review is missing', async () => {
            const sentCount = await service.notifyRespondents(999999);
            expect(sentCount).toBe(0);
        });
    });

    describe('notifyHrReportReady', () => {
        it('emails the HR for the review and persists a sent log', async () => {
            const cycleId = await makeCycle();
            const reviewId = await makeReview(cycleId);

            const sentCount = await service.notifyHrReportReady(reviewId);

            expect(sentCount).toBe(1);
            expect(mailer.calls[0].template).toBe('hr-report-ready');

            const log = await notificationLogRepo.findOneForReview(
                reviewId,
                NotificationKind.HR_REPORT_READY,
                hrId,
            );
            expect(log!.isSent()).toBe(true);
        });
    });

    describe('notifyReviewers', () => {
        it('emails every reviewer attached to the review', async () => {
            const cycleId = await makeCycle();
            const reviewId = await makeReview(cycleId);
            const reviewerUser = await userRepo.create(
                UserDomain.create({
                    firstName: 'Reviewer',
                    lastName: 'Person',
                    email: `rev.${Date.now()}.${Math.random()}@example.com`,
                }),
            );
            await reviewerRepo.create(
                ReviewerDomain.create({
                    reviewId,
                    reviewerId: reviewerUser.id!,
                    fullName: reviewerUser.fullName,
                    positionId,
                    positionTitle: 'Engineer',
                }),
            );

            const sentCount = await service.notifyReviewers(reviewId);

            expect(sentCount).toBe(1);
            expect(mailer.calls[0].template).toBe('reviewer-report-ready');
        });
    });

    describe('failure handling', () => {
        it('records the error message and reports 0 sent when the mailer throws', async () => {
            mailer.shouldFail = true;
            mailer.failureMessage = 'SMTP timed out';

            const sentCount = await service.notifyUserWelcome(rateeId);

            expect(sentCount).toBe(0);

            const log = await notificationLogRepo.findOneForUser(
                NotificationKind.USER_WELCOME,
                rateeId,
            );
            expect(log).not.toBeNull();
            expect(log!.isSent()).toBe(false);
            expect(log!.errorMessage).toBe('SMTP timed out');
        });
    });
});
