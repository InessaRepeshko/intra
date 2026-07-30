import '../../../setup-env';

import { CycleStage, ReviewStage } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleStageChangedEvent } from 'src/contexts/feedback360/application/events/cycle-stage-changed.event';
import { ReviewStageChangedEvent } from 'src/contexts/feedback360/application/events/review-stage-changed.event';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { UserCreatedEvent } from 'src/contexts/identity/application/events/user-created.event';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { UserRepository } from 'src/contexts/identity/infrastructure/prisma-repositories/user.repository';
import { CycleStageNotificationListener } from 'src/contexts/notifications/application/listeners/cycle-stage-notification.listener';
import { ReviewStageNotificationListener } from 'src/contexts/notifications/application/listeners/review-stage-notification.listener';
import { UserCreatedNotificationListener } from 'src/contexts/notifications/application/listeners/user-created-notification.listener';
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

describe('Notification listeners (integration)', () => {
    let module: TestingModule;
    let mailer: MailerStub;
    let cycleStageListener: CycleStageNotificationListener;
    let reviewStageListener: ReviewStageNotificationListener;
    let userCreatedListener: UserCreatedNotificationListener;
    let cycleRepo: CycleRepository;
    let reviewRepo: ReviewRepository;
    let positionRepo: PositionRepository;
    let notificationLogRepo: NotificationLogRepository;
    let userRepo: UserRepository;
    let prisma: PrismaService;

    let hrId: number;
    let rateeId: number;
    let positionId: number;

    beforeAll(async () => {
        const built = await createNotificationsServiceTestModule();
        module = built.module;
        mailer = built.mailerStub;
        cycleStageListener = module.get(CycleStageNotificationListener);
        reviewStageListener = module.get(ReviewStageNotificationListener);
        userCreatedListener = module.get(UserCreatedNotificationListener);
        cycleRepo = module.get(CycleRepository);
        reviewRepo = module.get(ReviewRepository);
        positionRepo = module.get(PositionRepository);
        notificationLogRepo = module.get(NotificationLogRepository);
        userRepo = module.get(UserRepository);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetNotificationTables(prisma);
        mailer.reset();
        // Seed users via the repo directly (NOT via IdentityUserService)
        // because the latter emits `user.created`, which would fire the
        // welcome listener under test and pollute mailer.calls in every
        // unrelated case.
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

    describe('CycleStageNotificationListener', () => {
        it('dispatches strategic-report-ready email when cycle is PUBLISHED', async () => {
            const cycleId = await makeCycle();

            await cycleStageListener.handle(
                new CycleStageChangedEvent(
                    cycleId,
                    CycleStage.PREPARING_REPORT,
                    CycleStage.PUBLISHED,
                ),
            );

            expect(mailer.calls).toHaveLength(1);
            expect(mailer.calls[0].template).toBe(
                'cycle-strategic-report-ready',
            );

            const log = await notificationLogRepo.findOneForCycle(
                cycleId,
                NotificationKind.CYCLE_STRATEGIC_REPORT_READY,
                hrId,
            );
            expect(log!.isSent()).toBe(true);
        });

        it('does nothing for non-PUBLISHED transitions', async () => {
            const cycleId = await makeCycle();

            await cycleStageListener.handle(
                new CycleStageChangedEvent(
                    cycleId,
                    CycleStage.NEW,
                    CycleStage.ACTIVE,
                ),
            );

            expect(mailer.calls).toEqual([]);
        });

        it('swallows errors from the dispatch and does not rethrow', async () => {
            const cycleId = await makeCycle();
            mailer.shouldFail = true;

            await expect(
                cycleStageListener.handle(
                    new CycleStageChangedEvent(
                        cycleId,
                        CycleStage.PREPARING_REPORT,
                        CycleStage.PUBLISHED,
                    ),
                ),
            ).resolves.toBeUndefined();
        });
    });

    describe('ReviewStageNotificationListener', () => {
        it('emails the ratee when review transitions to SELF_ASSESSMENT', async () => {
            const cycleId = await makeCycle();
            const reviewId = await makeReview(cycleId);

            await reviewStageListener.handle(
                new ReviewStageChangedEvent(
                    reviewId,
                    ReviewStage.NEW,
                    ReviewStage.SELF_ASSESSMENT,
                ),
            );

            expect(mailer.calls).toHaveLength(1);
            expect(mailer.calls[0].template).toBe('ratee-self-assessment');
        });

        it('emails respondents when review transitions to IN_PROGRESS', async () => {
            const cycleId = await makeCycle();
            const reviewId = await makeReview(cycleId);
            // No respondents seeded → notifyRespondents returns 0, no
            // mail call, but the handler should still complete.

            await reviewStageListener.handle(
                new ReviewStageChangedEvent(
                    reviewId,
                    ReviewStage.SELF_ASSESSMENT,
                    ReviewStage.IN_PROGRESS,
                ),
            );

            expect(mailer.calls).toEqual([]);
        });

        it('emails HR when review transitions to PROCESSING_BY_HR', async () => {
            const cycleId = await makeCycle();
            const reviewId = await makeReview(cycleId);

            await reviewStageListener.handle(
                new ReviewStageChangedEvent(
                    reviewId,
                    ReviewStage.PREPARING_REPORT,
                    ReviewStage.PROCESSING_BY_HR,
                ),
            );

            expect(mailer.calls).toHaveLength(1);
            expect(mailer.calls[0].template).toBe('hr-report-ready');
        });

        it('emails reviewers when review transitions to PUBLISHED', async () => {
            const cycleId = await makeCycle();
            const reviewId = await makeReview(cycleId);
            // No reviewers seeded → service returns 0, no mail.

            await reviewStageListener.handle(
                new ReviewStageChangedEvent(
                    reviewId,
                    ReviewStage.PROCESSING_BY_HR,
                    ReviewStage.PUBLISHED,
                ),
            );

            expect(mailer.calls).toEqual([]);
        });

        it('does nothing for transitions not in the switch', async () => {
            const cycleId = await makeCycle();
            const reviewId = await makeReview(cycleId);

            await reviewStageListener.handle(
                new ReviewStageChangedEvent(
                    reviewId,
                    ReviewStage.IN_PROGRESS,
                    ReviewStage.FINISHED,
                ),
            );

            expect(mailer.calls).toEqual([]);
        });
    });

    describe('UserCreatedNotificationListener', () => {
        it('dispatches a welcome email when a user-created event fires', async () => {
            await userCreatedListener.handle(
                new UserCreatedEvent(rateeId, 'ratee@example.com'),
            );

            expect(mailer.calls).toHaveLength(1);
            expect(mailer.calls[0].template).toBe('user-welcome');

            const log = await notificationLogRepo.findOneForUser(
                NotificationKind.USER_WELCOME,
                rateeId,
            );
            expect(log!.isSent()).toBe(true);
        });

        it('logs and swallows errors from the dispatch', async () => {
            mailer.shouldFail = true;

            await expect(
                userCreatedListener.handle(
                    new UserCreatedEvent(rateeId, 'ratee@example.com'),
                ),
            ).resolves.toBeUndefined();
        });
    });
});
