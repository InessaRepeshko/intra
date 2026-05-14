import { ReviewStage } from '@intra/shared-kernel';
import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ReviewStageProcessedEvent } from 'src/contexts/feedback360/application/events/review-stage-processed.event';
import { ReviewService } from 'src/contexts/feedback360/application/services/review.service';
import { ReviewStageListener } from 'src/contexts/reporting/application/listeners/review-stage.listener';
import { ReportingService } from 'src/contexts/reporting/application/services/reports.service';

beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('ReviewStageListener (reporting)', () => {
    let listener: ReviewStageListener;
    let reportService: any;
    let reviewService: any;

    beforeEach(async () => {
        reportService = { generateReportForReview: jest.fn() };
        reviewService = { changeReviewStage: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                ReviewStageListener,
                { provide: ReportingService, useValue: reportService },
                { provide: ReviewService, useValue: reviewService },
            ],
        }).compile();

        listener = module.get(ReviewStageListener);
    });

    it('ignores transitions that are not FINISHED', async () => {
        const event = new ReviewStageProcessedEvent(
            1,
            ReviewStage.IN_PROGRESS,
        );
        await listener.handleReviewStageProcessed(event);

        expect(reviewService.changeReviewStage).not.toHaveBeenCalled();
        expect(reportService.generateReportForReview).not.toHaveBeenCalled();
    });

    it('runs the report pipeline when FINISHED: PREPARING_REPORT → generate → PROCESSING_BY_HR', async () => {
        reportService.generateReportForReview.mockResolvedValue({ id: 99 });

        const event = new ReviewStageProcessedEvent(1, ReviewStage.FINISHED);
        await listener.handleReviewStageProcessed(event);

        expect(reviewService.changeReviewStage).toHaveBeenNthCalledWith(
            1,
            1,
            ReviewStage.PREPARING_REPORT,
        );
        expect(reportService.generateReportForReview).toHaveBeenCalledWith(1);
        expect(reviewService.changeReviewStage).toHaveBeenNthCalledWith(
            2,
            1,
            ReviewStage.PROCESSING_BY_HR,
        );
    });

    it('swallows errors from the report generation pipeline', async () => {
        reportService.generateReportForReview.mockRejectedValue(
            new Error('boom'),
        );

        const event = new ReviewStageProcessedEvent(1, ReviewStage.FINISHED);
        await expect(
            listener.handleReviewStageProcessed(event),
        ).resolves.toBeUndefined();

        expect(reviewService.changeReviewStage).toHaveBeenCalledWith(
            1,
            ReviewStage.PREPARING_REPORT,
        );
        expect(reviewService.changeReviewStage).not.toHaveBeenCalledWith(
            1,
            ReviewStage.PROCESSING_BY_HR,
        );
    });
});
