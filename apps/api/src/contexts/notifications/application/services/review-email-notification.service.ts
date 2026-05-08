import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    RESPONDENT_REPOSITORY,
    RespondentRepositoryPort,
} from 'src/contexts/feedback360/application/ports/respondent.repository.port';
import {
    REVIEW_REPOSITORY,
    ReviewRepositoryPort,
} from 'src/contexts/feedback360/application/ports/review.repository.port';
import {
    REVIEWER_REPOSITORY,
    ReviewerRepositoryPort,
} from 'src/contexts/feedback360/application/ports/reviewer.repository.port';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import {
    IDENTITY_USER_REPOSITORY,
    UserRepositoryPort,
} from 'src/contexts/identity/application/ports/user.repository.port';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import {
    STRATEGIC_REPORT_REPOSITORY,
    StrategicReportRepositoryPort,
} from 'src/contexts/reporting/application/ports/strategic-report.repository.port';
import { NotificationKind } from '../../domain/notification-kind.enum';
import { NotificationLogDomain } from '../../domain/notification-log.domain';
import {
    LOGO_BUFFER,
    LOGO_CID,
    LOGO_CONTENT_TYPE,
    LOGO_FILENAME,
} from '../../infrastructure/templates/logo-data-uri';
import { MAILER, MailerPort } from '../ports/mailer.port';
import {
    NOTIFICATION_LOG_REPOSITORY,
    NotificationLogRepositoryPort,
} from '../ports/notification-log.repository.port';

@Injectable()
export class ReviewEmailNotificationService {
    private readonly logger = new Logger(ReviewEmailNotificationService.name);

    constructor(
        @Inject(MAILER) private readonly mailer: MailerPort,
        @Inject(NOTIFICATION_LOG_REPOSITORY)
        private readonly notificationLogRepo: NotificationLogRepositoryPort,
        @Inject(REVIEW_REPOSITORY)
        private readonly reviewRepo: ReviewRepositoryPort,
        @Inject(RESPONDENT_REPOSITORY)
        private readonly respondentRepo: RespondentRepositoryPort,
        @Inject(REVIEWER_REPOSITORY)
        private readonly reviewerRepo: ReviewerRepositoryPort,
        @Inject(IDENTITY_USER_REPOSITORY)
        private readonly userRepo: UserRepositoryPort,
        @Inject(STRATEGIC_REPORT_REPOSITORY)
        private readonly strategicReportRepo: StrategicReportRepositoryPort,
        private readonly cycleService: CycleService,
        private readonly configService: ConfigService,
    ) {}

    /**
     * Send a welcome email to a freshly registered user. Triggered from
     * the identity context when a new user is created.
     *
     * Dedup is per-user (regardless of review/cycle), so re-creating the
     * same user-id (which doesn't really happen) or replaying the event
     * won't cause duplicate emails.
     */
    async notifyUserWelcome(userId: number): Promise<number> {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            this.logger.warn(`User ${userId} not found for welcome email`);
            return 0;
        }

        const sent = await this.dispatch({
            owner: { kind: 'user', id: userId },
            kind: NotificationKind.USER_WELCOME,
            recipient: user,
            subject: 'Welcome to Intra · Feedback360',
            template: 'user-welcome',
            actionUrl: this.buildUrl('dashboard'),
            extraContext: {
                userFirstName: user.firstName,
            },
        });

        return sent ? 1 : 0;
    }

    /**
     * Notify the HR responsible for the cycle that the strategic
     * (cycle-level) report is ready. Triggered when the cycle reaches
     * `CycleStage.PUBLISHED`.
     */
    async notifyCycleStrategicReportReady(cycleId: number): Promise<number> {
        const cycle = await this.cycleService.getById(cycleId);
        const strategicReport =
            await this.strategicReportRepo.findByCycleId(cycleId);

        const hr = await this.userRepo.findById(cycle.hrId);
        if (!hr) {
            this.logger.warn(`HR ${cycle.hrId} not found for cycle ${cycleId}`);
            return 0;
        }

        const sent = await this.dispatch({
            owner: { kind: 'cycle', id: cycleId },
            kind: NotificationKind.CYCLE_STRATEGIC_REPORT_READY,
            recipient: hr,
            subject: `Strategic report ready: ${cycle.title}`,
            template: 'cycle-strategic-report-ready',
            actionUrl: this.buildUrl(
                `reporting/strategic-reports/${strategicReport?.id}`,
            ),
            extraContext: {
                hrFirstName: hr.firstName,
                cycleTitle: cycle.title,
            },
        });

        return sent ? 1 : 0;
    }

    async notifyRateeSelfAssessment(reviewId: number): Promise<number> {
        const review = await this.reviewRepo.findById(reviewId);
        if (!review) {
            this.logger.warn(`Review ${reviewId} not found`);
            return 0;
        }

        const ratee = await this.userRepo.findById(review.rateeId);
        if (!ratee) {
            this.logger.warn(
                `Ratee ${review.rateeId} not found for review ${reviewId}`,
            );
            return 0;
        }

        const sent = await this.dispatch({
            owner: { kind: 'review', id: review.id! },
            kind: NotificationKind.RATEE_SELF_ASSESSMENT,
            recipient: ratee,
            subject: 'A new 360° review has been created for you',
            template: 'ratee-self-assessment',
            actionUrl: this.buildUrl(`feedback360/surveys/${review.id}`),
            extraContext: {
                rateeFirstName: ratee.firstName,
            },
        });

        return sent ? 1 : 0;
    }

    async notifyRespondents(reviewId: number): Promise<number> {
        const review = await this.reviewRepo.findById(reviewId);
        if (!review) {
            this.logger.warn(`Review ${reviewId} not found`);
            return 0;
        }

        const respondents = await this.respondentRepo.listByReview(
            reviewId,
            {},
        );

        let sentCount = 0;

        for (const respondent of respondents) {
            const user = await this.userRepo.findById(respondent.respondentId);
            if (!user) {
                this.logger.warn(
                    `Respondent user ${respondent.respondentId} not found`,
                );
                continue;
            }

            const sent = await this.dispatch({
                owner: { kind: 'review', id: review.id! },
                kind: NotificationKind.RESPONDENT_INVITATION,
                recipient: user,
                subject: `Your feedback is requested for ${review.rateeFullName}`,
                template: 'respondent-invitation',
                actionUrl: this.buildUrl(`feedback360/surveys/${review.id}`),
                extraContext: {
                    respondentFirstName: user.firstName,
                    rateeFullName: review.rateeFullName,
                    rateeFirstName: review.rateeFullName.split(' ')[0],
                },
            });

            if (sent) {
                sentCount += 1;
            }
        }

        return sentCount;
    }

    async notifyHrReportReady(reviewId: number): Promise<number> {
        const review = await this.reviewRepo.findById(reviewId);
        if (!review) {
            this.logger.warn(`Review ${reviewId} not found`);
            return 0;
        }

        const hr = await this.userRepo.findById(review.hrId);
        if (!hr) {
            this.logger.warn(
                `HR ${review.hrId} not found for review ${reviewId}`,
            );
            return 0;
        }

        const sent = await this.dispatch({
            owner: { kind: 'review', id: review.id! },
            kind: NotificationKind.HR_REPORT_READY,
            recipient: hr,
            subject: `Review report ready: ${review.rateeFullName}`,
            template: 'hr-report-ready',
            actionUrl: this.buildUrl(
                `reporting/individual-reports/${review.reportId}/comments`,
            ),
            extraContext: {
                hrFirstName: hr.firstName,
                rateeFullName: review.rateeFullName,
            },
        });

        return sent ? 1 : 0;
    }

    async notifyReviewers(reviewId: number): Promise<number> {
        const review = await this.reviewRepo.findById(reviewId);
        if (!review) {
            this.logger.warn(`Review ${reviewId} not found`);
            return 0;
        }

        const reviewers = await this.reviewerRepo.listByReview(reviewId, {});

        let sentCount = 0;

        for (const reviewer of reviewers) {
            const user = await this.userRepo.findById(reviewer.reviewerId);
            if (!user) {
                this.logger.warn(
                    `Reviewer user ${reviewer.reviewerId} not found`,
                );
                continue;
            }

            const sent = await this.dispatch({
                owner: { kind: 'review', id: review.id! },
                kind: NotificationKind.REVIEWER_REPORT_READY,
                recipient: user,
                subject: `Individual report ready: ${review.rateeFullName}`,
                template: 'reviewer-report-ready',
                actionUrl: this.buildUrl(
                    `reporting/individual-reports/${review.reportId}`,
                ),
                extraContext: {
                    reviewerFirstName: user.firstName,
                    rateeFullName: review.rateeFullName,
                },
            });

            if (sent) {
                sentCount += 1;
            }
        }

        return sentCount;
    }

    private async dispatch(args: {
        owner:
            | { kind: 'review'; id: number }
            | { kind: 'cycle'; id: number }
            | { kind: 'user'; id: number };
        kind: NotificationKind;
        recipient: UserDomain;
        subject: string;
        template: string;
        actionUrl: string;
        extraContext: Record<string, unknown>;
    }): Promise<boolean> {
        const { owner, kind, recipient, subject, template, actionUrl } = args;

        if (!owner.id) {
            this.logger.warn(`${owner.kind} without id, skipping ${kind}`);
            return false;
        }
        if (!recipient.id) {
            this.logger.warn(`Recipient without id, skipping ${kind}`);
            return false;
        }
        if (!recipient.email) {
            this.logger.warn(
                `Recipient ${recipient.id} has no email, skipping ${kind}`,
            );
            return false;
        }

        const ownerLabel = `${owner.kind}=${owner.id}`;

        let existing;
        if (owner.kind === 'review') {
            existing = await this.notificationLogRepo.findOneForReview(
                owner.id,
                kind,
                recipient.id,
            );
        } else if (owner.kind === 'cycle') {
            existing = await this.notificationLogRepo.findOneForCycle(
                owner.id,
                kind,
                recipient.id,
            );
        } else {
            existing = await this.notificationLogRepo.findOneForUser(
                kind,
                recipient.id,
            );
        }

        if (existing?.isSent()) {
            this.logger.debug(
                `Skipping ${kind} for ${ownerLabel} user=${recipient.id} (already sent)`,
            );
            return false;
        }

        const log =
            existing ??
            (await this.notificationLogRepo.create(
                NotificationLogDomain.create({
                    reviewId: owner.kind === 'review' ? owner.id : null,
                    cycleId: owner.kind === 'cycle' ? owner.id : null,
                    kind,
                    recipientUserId: recipient.id,
                    recipientEmail: recipient.email,
                }),
            ));

        const context = {
            ...args.extraContext,
            actionUrl,
            subject,
            supportEmail: this.configService.get<string>('app.supportEmail'),
            logoCid: LOGO_CID,
            appName: 'Intra',
        };

        try {
            await this.mailer.sendMail({
                to: recipient.email,
                subject,
                template,
                context,
                attachments: [
                    {
                        filename: LOGO_FILENAME,
                        content: LOGO_BUFFER,
                        contentType: LOGO_CONTENT_TYPE,
                        cid: LOGO_CID,
                    },
                ],
            });
            await this.notificationLogRepo.markSent(log.id!);
            this.logger.log(
                `Sent ${kind} for ${ownerLabel} to user=${recipient.id}`,
            );
            return true;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            this.logger.error(
                `Failed to send ${kind} for ${ownerLabel} to user=${recipient.id}: ${message}`,
                error instanceof Error ? error.stack : undefined,
            );
            await this.notificationLogRepo.markFailure(log.id!, message);
            return false;
        }
    }

    private buildUrl(path: string): string {
        const base = this.configService.get<string>('app.frontendLink') ?? '/';
        const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
        const trimmedPath = path.startsWith('/') ? path.slice(1) : path;
        return `${trimmedBase}/${trimmedPath}`;
    }
}
