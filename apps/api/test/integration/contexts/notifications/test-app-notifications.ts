import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import appConfig from 'src/config/app';
import databaseConfig from 'src/config/database';
import { CYCLE_STAGE_HISTORY_REPOSITORY } from 'src/contexts/feedback360/application/ports/cycle-stage-history.repository.port';
import { CYCLE_REPOSITORY } from 'src/contexts/feedback360/application/ports/cycle.repository.port';
import { RESPONDENT_REPOSITORY } from 'src/contexts/feedback360/application/ports/respondent.repository.port';
import { REVIEW_REPOSITORY } from 'src/contexts/feedback360/application/ports/review.repository.port';
import { REVIEWER_REPOSITORY } from 'src/contexts/feedback360/application/ports/reviewer.repository.port';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import { CycleStageHistoryRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle-stage-history.repository';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { RespondentRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/respondent.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { ReviewerRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/reviewer.repository';
import { IDENTITY_ROLE_REPOSITORY } from 'src/contexts/identity/application/ports/role.repository.port';
import { IDENTITY_USER_REPOSITORY } from 'src/contexts/identity/application/ports/user.repository.port';
import { IdentityRoleService } from 'src/contexts/identity/application/services/identity-role.service';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { RoleRepository } from 'src/contexts/identity/infrastructure/prisma-repositories/role.repository';
import { UserRepository } from 'src/contexts/identity/infrastructure/prisma-repositories/user.repository';
import { CycleStageNotificationListener } from 'src/contexts/notifications/application/listeners/cycle-stage-notification.listener';
import { ReviewStageNotificationListener } from 'src/contexts/notifications/application/listeners/review-stage-notification.listener';
import { UserCreatedNotificationListener } from 'src/contexts/notifications/application/listeners/user-created-notification.listener';
import {
    MAILER,
    MailerPort,
    MailerSendOptions,
} from 'src/contexts/notifications/application/ports/mailer.port';
import { NOTIFICATION_LOG_REPOSITORY } from 'src/contexts/notifications/application/ports/notification-log.repository.port';
import { ReviewEmailNotificationService } from 'src/contexts/notifications/application/services/review-email-notification.service';
import { NotificationLogRepository } from 'src/contexts/notifications/infrastructure/prisma-repositories/notification-log.repository';
import { ORGANISATION_POSITION_REPOSITORY } from 'src/contexts/organisation/application/ports/position.repository.port';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { STRATEGIC_REPORT_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report.repository.port';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaService } from 'src/database/prisma.service';
import { ensureTestDatabaseExists } from '../../setup-env';

/**
 * In-memory mailer that records every `sendMail()` invocation. Tests
 * inspect `calls` to assert that the right templates / recipients went
 * out, and toggle `shouldFail` to drive the failure branch.
 */
export class MailerStub implements MailerPort {
    readonly calls: MailerSendOptions[] = [];
    shouldFail = false;
    failureMessage = 'SMTP failure (stub)';

    async sendMail(options: MailerSendOptions): Promise<void> {
        this.calls.push(options);
        if (this.shouldFail) {
            throw new Error(this.failureMessage);
        }
    }

    reset(): void {
        this.calls.length = 0;
        this.shouldFail = false;
    }
}

/**
 * Bootstraps a Nest testing module for the notifications context wired
 * to the real database. We assemble providers manually instead of
 * importing `NotificationsModule` because that module pulls in
 * `MailerModule` (Gmail OAuth2), `Feedback360Module`, `ReportingModule`
 * and `IdentityModule` — none of which are needed for repository-level
 * tests against `NotificationLog`.
 *
 * Cross-context dependencies wired in:
 * - Identity (`IdentityUserService`) so notification log entries can
 *   reference real `identity_users` rows for `recipientUserId`.
 * - Feedback360 (`CycleRepository`, `ReviewRepository`) so logs can
 *   reference real cycles and reviews for FK / cascade behaviour.
 * - Organisation (`PositionRepository`) because reviews require a
 *   real position id.
 */
export async function createNotificationsTestModule(): Promise<TestingModule> {
    await ensureTestDatabaseExists();

    const module = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [appConfig, databaseConfig],
                ignoreEnvFile: true,
            }),
            EventEmitterModule.forRoot(),
            DatabaseModule,
        ],
        providers: [
            // Notifications
            NotificationLogRepository,
            {
                provide: NOTIFICATION_LOG_REPOSITORY,
                useExisting: NotificationLogRepository,
            },
            // Identity
            IdentityUserService,
            IdentityRoleService,
            UserRepository,
            RoleRepository,
            { provide: IDENTITY_USER_REPOSITORY, useExisting: UserRepository },
            { provide: IDENTITY_ROLE_REPOSITORY, useExisting: RoleRepository },
            // Organisation
            PositionRepository,
            {
                provide: ORGANISATION_POSITION_REPOSITORY,
                useExisting: PositionRepository,
            },
            // Feedback360
            CycleRepository,
            ReviewRepository,
            { provide: CYCLE_REPOSITORY, useExisting: CycleRepository },
            { provide: REVIEW_REPOSITORY, useExisting: ReviewRepository },
        ],
    }).compile();

    await module.init();
    return module;
}

/**
 * Bootstraps a richer test module that includes
 * `ReviewEmailNotificationService`. Returns the testing module plus a
 * `MailerStub` instance — tests use the stub to assert outbound mail
 * calls without standing up a real SMTP transport. The `STRATEGIC_REPORT_REPOSITORY`
 * is wired with an inline stub because we don't need the real reporting
 * context here.
 */
export async function createNotificationsServiceTestModule(): Promise<{
    module: TestingModule;
    mailerStub: MailerStub;
}> {
    await ensureTestDatabaseExists();

    const mailerStub = new MailerStub();
    const strategicReportStub = {
        async findByCycleId() {
            return null;
        },
        async create() {
            throw new Error('not implemented in test stub');
        },
        async findById() {
            return null;
        },
        async search() {
            return [];
        },
    };

    const module = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [appConfig, databaseConfig],
                ignoreEnvFile: true,
            }),
            EventEmitterModule.forRoot(),
            DatabaseModule,
        ],
        providers: [
            // Notifications
            ReviewEmailNotificationService,
            CycleStageNotificationListener,
            ReviewStageNotificationListener,
            UserCreatedNotificationListener,
            NotificationLogRepository,
            {
                provide: NOTIFICATION_LOG_REPOSITORY,
                useExisting: NotificationLogRepository,
            },
            { provide: MAILER, useValue: mailerStub },
            // Identity
            IdentityUserService,
            IdentityRoleService,
            UserRepository,
            RoleRepository,
            { provide: IDENTITY_USER_REPOSITORY, useExisting: UserRepository },
            { provide: IDENTITY_ROLE_REPOSITORY, useExisting: RoleRepository },
            // Organisation
            PositionRepository,
            {
                provide: ORGANISATION_POSITION_REPOSITORY,
                useExisting: PositionRepository,
            },
            // Feedback360
            CycleService,
            CycleRepository,
            ReviewRepository,
            RespondentRepository,
            ReviewerRepository,
            CycleStageHistoryRepository,
            { provide: CYCLE_REPOSITORY, useExisting: CycleRepository },
            { provide: REVIEW_REPOSITORY, useExisting: ReviewRepository },
            {
                provide: RESPONDENT_REPOSITORY,
                useExisting: RespondentRepository,
            },
            { provide: REVIEWER_REPOSITORY, useExisting: ReviewerRepository },
            {
                provide: CYCLE_STAGE_HISTORY_REPOSITORY,
                useExisting: CycleStageHistoryRepository,
            },
            // Reporting — stub
            {
                provide: STRATEGIC_REPORT_REPOSITORY,
                useValue: strategicReportStub,
            },
        ],
    }).compile();

    await module.init();
    return { module, mailerStub };
}

/**
 * Truncates the notification_logs table plus every cross-context table
 * notifications scenarios touch. The order is not significant because
 * we use CASCADE. `identity_roles` (reference data) is preserved.
 */
export async function resetNotificationTables(
    prisma: PrismaService,
): Promise<void> {
    await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE
            "notification_logs",
            "feedback360_cycle_stage_history",
            "feedback360_respondents",
            "feedback360_reviewers",
            "feedback360_reviews",
            "feedback360_cycles",
            "org_positions",
            "identity_users_roles",
            "identity_users"
         RESTART IDENTITY CASCADE`,
    );
}
