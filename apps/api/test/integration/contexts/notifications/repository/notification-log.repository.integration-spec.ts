import '../../../setup-env';

import { ReviewStage } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { NotificationChannel } from 'src/contexts/notifications/domain/notification-channel.enum';
import { NotificationKind } from 'src/contexts/notifications/domain/notification-kind.enum';
import { NotificationLogDomain } from 'src/contexts/notifications/domain/notification-log.domain';
import { NotificationLogRepository } from 'src/contexts/notifications/infrastructure/prisma-repositories/notification-log.repository';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createNotificationsTestModule,
    resetNotificationTables,
} from '../test-app-notifications';

describe('NotificationLogRepository (integration)', () => {
    let module: TestingModule;
    let repo: NotificationLogRepository;
    let cycles: CycleRepository;
    let reviews: ReviewRepository;
    let positions: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let recipientUserId: number;
    let hrId: number;
    let positionId: number;

    beforeAll(async () => {
        module = await createNotificationsTestModule();
        repo = module.get(NotificationLogRepository);
        cycles = module.get(CycleRepository);
        reviews = module.get(ReviewRepository);
        positions = module.get(PositionRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetNotificationTables(prisma);
        const hr = await identityUsers.create({
            firstName: 'Helena',
            lastName: 'Reed',
            email: `hr.${Date.now()}@example.com`,
        } as any);
        const recipient = await identityUsers.create({
            firstName: 'Recipient',
            lastName: 'Person',
            email: `recipient.${Date.now()}@example.com`,
        } as any);
        const position = await positions.create(
            PositionDomain.create({ title: 'Engineer' }),
        );

        hrId = hr.id!;
        recipientUserId = recipient.id!;
        positionId = position.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    async function makeCycle(): Promise<number> {
        const cycle = await cycles.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );
        return cycle.id!;
    }

    async function makeReview(cycleId: number): Promise<number> {
        const ratee = await identityUsers.create({
            firstName: 'Ratee',
            lastName: 'Smith',
            email: `ratee.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        const review = await reviews.create(
            ReviewDomain.create({
                rateeId: ratee.id!,
                rateeFullName: 'Ratee Smith',
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

    function buildLog(
        overrides: Partial<{
            reviewId: number | null;
            cycleId: number | null;
            kind: NotificationKind;
            recipientEmail: string;
            recipientUserId: number;
        }> = {},
    ): NotificationLogDomain {
        return NotificationLogDomain.create({
            reviewId: overrides.reviewId ?? null,
            cycleId: overrides.cycleId ?? null,
            kind: overrides.kind ?? NotificationKind.USER_WELCOME,
            recipientUserId: overrides.recipientUserId ?? recipientUserId,
            recipientEmail: overrides.recipientEmail ?? 'r@example.com',
        });
    }

    describe('create', () => {
        it('persists a log with channel EMAIL by default', async () => {
            const created = await repo.create(buildLog());

            expect(created.id).toBeDefined();
            expect(created.channel).toBe(NotificationChannel.EMAIL);
            expect(created.kind).toBe(NotificationKind.USER_WELCOME);
            expect(created.sentAt).toBeNull();
            expect(created.errorMessage).toBeNull();

            const fromDb = await prisma.notificationLog.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.recipientUserId).toBe(recipientUserId);
        });

        it('persists a log tied to a review', async () => {
            const cycleId = await makeCycle();
            const reviewId = await makeReview(cycleId);

            const created = await repo.create(
                buildLog({
                    reviewId,
                    kind: NotificationKind.RATEE_SELF_ASSESSMENT,
                }),
            );

            expect(created.reviewId).toBe(reviewId);
        });

        it('persists a log tied to a cycle', async () => {
            const cycleId = await makeCycle();

            const created = await repo.create(
                buildLog({
                    cycleId,
                    kind: NotificationKind.CYCLE_STRATEGIC_REPORT_READY,
                }),
            );

            expect(created.cycleId).toBe(cycleId);
        });
    });

    describe('findOneForReview', () => {
        it('returns the log matching (reviewId, kind, recipientUserId)', async () => {
            const cycleId = await makeCycle();
            const reviewId = await makeReview(cycleId);
            await repo.create(
                buildLog({
                    reviewId,
                    kind: NotificationKind.RATEE_SELF_ASSESSMENT,
                }),
            );

            const fetched = await repo.findOneForReview(
                reviewId,
                NotificationKind.RATEE_SELF_ASSESSMENT,
                recipientUserId,
            );

            expect(fetched).toBeInstanceOf(NotificationLogDomain);
            expect(fetched!.reviewId).toBe(reviewId);
        });

        it('returns null when no match exists', async () => {
            const cycleId = await makeCycle();
            const reviewId = await makeReview(cycleId);

            await expect(
                repo.findOneForReview(
                    reviewId,
                    NotificationKind.RATEE_SELF_ASSESSMENT,
                    recipientUserId,
                ),
            ).resolves.toBeNull();
        });

        it('enforces the unique (reviewId, kind, recipientUserId) constraint', async () => {
            const cycleId = await makeCycle();
            const reviewId = await makeReview(cycleId);
            await repo.create(
                buildLog({
                    reviewId,
                    kind: NotificationKind.RATEE_SELF_ASSESSMENT,
                }),
            );

            await expect(
                repo.create(
                    buildLog({
                        reviewId,
                        kind: NotificationKind.RATEE_SELF_ASSESSMENT,
                    }),
                ),
            ).rejects.toThrow();
        });
    });

    describe('findOneForCycle', () => {
        it('returns the log matching (cycleId, kind, recipientUserId)', async () => {
            const cycleId = await makeCycle();
            await repo.create(
                buildLog({
                    cycleId,
                    kind: NotificationKind.CYCLE_STRATEGIC_REPORT_READY,
                }),
            );

            const fetched = await repo.findOneForCycle(
                cycleId,
                NotificationKind.CYCLE_STRATEGIC_REPORT_READY,
                recipientUserId,
            );

            expect(fetched).toBeInstanceOf(NotificationLogDomain);
            expect(fetched!.cycleId).toBe(cycleId);
        });

        it('returns null when no match exists', async () => {
            const cycleId = await makeCycle();

            await expect(
                repo.findOneForCycle(
                    cycleId,
                    NotificationKind.CYCLE_STRATEGIC_REPORT_READY,
                    recipientUserId,
                ),
            ).resolves.toBeNull();
        });

        it('enforces the unique (cycleId, kind, recipientUserId) constraint', async () => {
            const cycleId = await makeCycle();
            await repo.create(
                buildLog({
                    cycleId,
                    kind: NotificationKind.CYCLE_STRATEGIC_REPORT_READY,
                }),
            );

            await expect(
                repo.create(
                    buildLog({
                        cycleId,
                        kind: NotificationKind.CYCLE_STRATEGIC_REPORT_READY,
                    }),
                ),
            ).rejects.toThrow();
        });
    });

    describe('findOneForUser', () => {
        it('returns the welcome-style log for the user (cycleId/reviewId both null)', async () => {
            await repo.create(
                buildLog({ kind: NotificationKind.USER_WELCOME }),
            );

            const fetched = await repo.findOneForUser(
                NotificationKind.USER_WELCOME,
                recipientUserId,
            );

            expect(fetched).toBeInstanceOf(NotificationLogDomain);
            expect(fetched!.reviewId).toBeNull();
            expect(fetched!.cycleId).toBeNull();
        });

        it('does not match logs that have a reviewId or cycleId set', async () => {
            const cycleId = await makeCycle();
            const reviewId = await makeReview(cycleId);
            // Different kind, attached to a review
            await repo.create(
                buildLog({
                    reviewId,
                    kind: NotificationKind.RATEE_SELF_ASSESSMENT,
                }),
            );

            await expect(
                repo.findOneForUser(
                    NotificationKind.USER_WELCOME,
                    recipientUserId,
                ),
            ).resolves.toBeNull();
        });

        it('returns null when there is no welcome log', async () => {
            await expect(
                repo.findOneForUser(
                    NotificationKind.USER_WELCOME,
                    recipientUserId,
                ),
            ).resolves.toBeNull();
        });
    });

    describe('markSent', () => {
        it('sets sentAt to a non-null value and clears errorMessage', async () => {
            const created = await repo.create(buildLog());
            // Pre-set an error message to verify it gets cleared.
            await repo.markFailure(created.id!, 'temporary failure');

            await repo.markSent(created.id!);

            const fromDb = await prisma.notificationLog.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.sentAt).not.toBeNull();
            expect(fromDb!.errorMessage).toBeNull();
        });
    });

    describe('markFailure', () => {
        it('persists the error message', async () => {
            const created = await repo.create(buildLog());

            await repo.markFailure(created.id!, 'SMTP timed out');

            const fromDb = await prisma.notificationLog.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.errorMessage).toBe('SMTP timed out');
            expect(fromDb!.sentAt).toBeNull();
        });
    });

    describe('cascade behaviour', () => {
        it('cascade-deletes logs when their cycle is removed', async () => {
            const cycleId = await makeCycle();
            const log = await repo.create(
                buildLog({
                    cycleId,
                    kind: NotificationKind.CYCLE_STRATEGIC_REPORT_READY,
                }),
            );

            await prisma.cycle.delete({ where: { id: cycleId } });

            const fromDb = await prisma.notificationLog.findUnique({
                where: { id: log.id! },
            });
            expect(fromDb).toBeNull();
        });
    });

    describe('isSent (domain)', () => {
        it('flips from false to true once persisted with sentAt', async () => {
            const created = await repo.create(buildLog());
            expect(created.isSent()).toBe(false);

            await repo.markSent(created.id!);
            const reloaded = await repo.findOneForUser(
                NotificationKind.USER_WELCOME,
                recipientUserId,
            );

            expect(reloaded!.isSent()).toBe(true);
        });
    });
});
