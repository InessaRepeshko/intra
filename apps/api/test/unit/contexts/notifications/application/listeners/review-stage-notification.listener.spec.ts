import { ReviewStage } from '@intra/shared-kernel';
import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ReviewStageChangedEvent } from 'src/contexts/feedback360/application/events/review-stage-changed.event';
import { ReviewStageNotificationListener } from 'src/contexts/notifications/application/listeners/review-stage-notification.listener';
import { ReviewEmailNotificationService } from 'src/contexts/notifications/application/services/review-email-notification.service';

beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('ReviewStageNotificationListener', () => {
    let listener: ReviewStageNotificationListener;
    let notifications: any;

    beforeEach(async () => {
        notifications = {
            notifyRateeSelfAssessment: jest.fn(),
            notifyRespondents: jest.fn(),
            notifyHrReportReady: jest.fn(),
            notifyReviewers: jest.fn(),
        };

        const module = await Test.createTestingModule({
            providers: [
                ReviewStageNotificationListener,
                {
                    provide: ReviewEmailNotificationService,
                    useValue: notifications,
                },
            ],
        }).compile();

        listener = module.get(ReviewStageNotificationListener);
    });

    function event(toStage: ReviewStage): ReviewStageChangedEvent {
        return new ReviewStageChangedEvent(10, ReviewStage.NEW, toStage);
    }

    it('triggers the ratee self-assessment email when the review reaches SELF_ASSESSMENT', async () => {
        notifications.notifyRateeSelfAssessment.mockResolvedValue(1);

        await listener.handle(event(ReviewStage.SELF_ASSESSMENT));

        expect(notifications.notifyRateeSelfAssessment).toHaveBeenCalledWith(
            10,
        );
        expect(notifications.notifyRespondents).not.toHaveBeenCalled();
    });

    it('triggers the respondents email when the review reaches IN_PROGRESS', async () => {
        notifications.notifyRespondents.mockResolvedValue(3);

        await listener.handle(event(ReviewStage.IN_PROGRESS));

        expect(notifications.notifyRespondents).toHaveBeenCalledWith(10);
    });

    it('triggers the HR report-ready email when the review reaches PROCESSING_BY_HR', async () => {
        notifications.notifyHrReportReady.mockResolvedValue(1);

        await listener.handle(event(ReviewStage.PROCESSING_BY_HR));

        expect(notifications.notifyHrReportReady).toHaveBeenCalledWith(10);
    });

    it('triggers the reviewers email when the review reaches PUBLISHED', async () => {
        notifications.notifyReviewers.mockResolvedValue(2);

        await listener.handle(event(ReviewStage.PUBLISHED));

        expect(notifications.notifyReviewers).toHaveBeenCalledWith(10);
    });

    it('ignores other review stage transitions', async () => {
        await listener.handle(event(ReviewStage.FINISHED));

        expect(notifications.notifyRateeSelfAssessment).not.toHaveBeenCalled();
        expect(notifications.notifyRespondents).not.toHaveBeenCalled();
        expect(notifications.notifyHrReportReady).not.toHaveBeenCalled();
        expect(notifications.notifyReviewers).not.toHaveBeenCalled();
    });

    it('swallows errors thrown by the notification service', async () => {
        notifications.notifyRespondents.mockRejectedValue(new Error('boom'));

        await expect(
            listener.handle(event(ReviewStage.IN_PROGRESS)),
        ).resolves.toBeUndefined();
    });
});
