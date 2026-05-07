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
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import {
    IDENTITY_USER_REPOSITORY,
    UserRepositoryPort,
} from 'src/contexts/identity/application/ports/user.repository.port';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { NotificationKind } from '../../domain/notification-kind.enum';
import { NotificationLogDomain } from '../../domain/notification-log.domain';
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
        private readonly configService: ConfigService,
    ) {}

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
            review,
            kind: NotificationKind.RATEE_SELF_ASSESSMENT,
            recipient: ratee,
            subject: 'A new 360° review has been created for you',
            template: 'ratee-self-assessment',
            actionUrl: this.buildUrl(`reviews/${review.id}/self-assessment`),
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
                review,
                kind: NotificationKind.RESPONDENT_INVITATION,
                recipient: user,
                subject: `Your feedback is requested for ${review.rateeFullName}`,
                template: 'respondent-invitation',
                actionUrl: this.buildUrl(`respondents/${respondent.id}`),
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
            review,
            kind: NotificationKind.HR_REPORT_READY,
            recipient: hr,
            subject: `Review report ready: ${review.rateeFullName}`,
            template: 'hr-report-ready',
            actionUrl: this.buildUrl(`hr/reviews/${review.id}/comments`),
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
                review,
                kind: NotificationKind.REVIEWER_REPORT_READY,
                recipient: user,
                subject: `Individual report ready: ${review.rateeFullName}`,
                template: 'reviewer-report-ready',
                actionUrl: this.buildUrl(`reports/${review.id}`),
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
        review: ReviewDomain;
        kind: NotificationKind;
        recipient: UserDomain;
        subject: string;
        template: string;
        actionUrl: string;
        extraContext: Record<string, unknown>;
    }): Promise<boolean> {
        const { review, kind, recipient, subject, template, actionUrl } = args;
        const reviewId = review.id;

        if (!reviewId) {
            this.logger.warn(`Review without id, skipping ${kind}`);
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

        const existing = await this.notificationLogRepo.findOne(
            reviewId,
            kind,
            recipient.id,
        );

        if (existing?.isSent()) {
            this.logger.debug(
                `Skipping ${kind} for review=${reviewId} user=${recipient.id} (already sent)`,
            );
            return false;
        }

        const log =
            existing ??
            (await this.notificationLogRepo.create(
                NotificationLogDomain.create({
                    reviewId,
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
        };

        try {
            await this.mailer.sendMail({
                to: recipient.email,
                subject,
                template,
                context,
            });
            await this.notificationLogRepo.markSent(log.id!);
            this.logger.log(
                `Sent ${kind} for review=${reviewId} to user=${recipient.id}`,
            );
            return true;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            this.logger.error(
                `Failed to send ${kind} for review=${reviewId} to user=${recipient.id}: ${message}`,
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
