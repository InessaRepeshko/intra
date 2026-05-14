import { CycleStage } from '@intra/shared-kernel';
import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CycleStageChangedEvent } from 'src/contexts/feedback360/application/events/cycle-stage-changed.event';
import { CycleStageNotificationListener } from 'src/contexts/notifications/application/listeners/cycle-stage-notification.listener';
import { ReviewEmailNotificationService } from 'src/contexts/notifications/application/services/review-email-notification.service';

beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('CycleStageNotificationListener', () => {
    let listener: CycleStageNotificationListener;
    let notifications: any;

    beforeEach(async () => {
        notifications = { notifyCycleStrategicReportReady: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                CycleStageNotificationListener,
                {
                    provide: ReviewEmailNotificationService,
                    useValue: notifications,
                },
            ],
        }).compile();

        listener = module.get(CycleStageNotificationListener);
    });

    it('triggers the strategic-report email when the cycle reaches PUBLISHED', async () => {
        notifications.notifyCycleStrategicReportReady.mockResolvedValue(1);

        const event = new CycleStageChangedEvent(
            100,
            CycleStage.PREPARING_REPORT,
            CycleStage.PUBLISHED,
        );

        await listener.handle(event);

        expect(
            notifications.notifyCycleStrategicReportReady,
        ).toHaveBeenCalledWith(100);
    });

    it('ignores other cycle stage transitions', async () => {
        await listener.handle(
            new CycleStageChangedEvent(100, CycleStage.NEW, CycleStage.ACTIVE),
        );

        expect(
            notifications.notifyCycleStrategicReportReady,
        ).not.toHaveBeenCalled();
    });

    it('swallows errors thrown by the notification service', async () => {
        notifications.notifyCycleStrategicReportReady.mockRejectedValue(
            new Error('boom'),
        );

        await expect(
            listener.handle(
                new CycleStageChangedEvent(
                    100,
                    CycleStage.PREPARING_REPORT,
                    CycleStage.PUBLISHED,
                ),
            ),
        ).resolves.toBeUndefined();
    });
});
