import { CycleStage } from '@intra/shared-kernel';
import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CycleStageProcessedEvent } from 'src/contexts/feedback360/application/events/cycle-stage-processed.event';
import { REVIEW_REPOSITORY } from 'src/contexts/feedback360/application/ports/review.repository.port';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import { CycleStageListener } from 'src/contexts/reporting/application/listeners/cycle-stage.listener';
import { StrategicReportingService } from 'src/contexts/reporting/application/services/strategic-reports.service';

beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('CycleStageListener (reporting)', () => {
    let listener: CycleStageListener;
    let strategicReportingService: any;
    let cycleService: any;
    let reviews: any;

    beforeEach(async () => {
        jest.useFakeTimers();
        strategicReportingService = {
            generateStrategicReportForCycle: jest.fn(),
        };
        cycleService = { changeStage: jest.fn() };
        reviews = { listByCycleId: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                CycleStageListener,
                {
                    provide: StrategicReportingService,
                    useValue: strategicReportingService,
                },
                { provide: CycleService, useValue: cycleService },
                { provide: REVIEW_REPOSITORY, useValue: reviews },
            ],
        }).compile();

        listener = module.get(CycleStageListener);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('ignores transitions that are not FINISHED', async () => {
        const event = new CycleStageProcessedEvent(1, CycleStage.ACTIVE);
        await listener.handleCycleStageProcessed(event);

        expect(cycleService.changeStage).not.toHaveBeenCalled();
        expect(
            strategicReportingService.generateStrategicReportForCycle,
        ).not.toHaveBeenCalled();
    });

    it('runs the report pipeline when FINISHED: PREPARING_REPORT → generate → PUBLISHED', async () => {
        strategicReportingService.generateStrategicReportForCycle.mockResolvedValue(
            { id: 99 },
        );
        reviews.listByCycleId.mockResolvedValue([{ id: 1 }]);

        const event = new CycleStageProcessedEvent(1, CycleStage.FINISHED);
        await listener.handleCycleStageProcessed(event);

        expect(cycleService.changeStage).toHaveBeenNthCalledWith(
            1,
            1,
            CycleStage.PREPARING_REPORT,
        );
        expect(
            strategicReportingService.generateStrategicReportForCycle,
        ).toHaveBeenCalledWith(1);
        expect(cycleService.changeStage).toHaveBeenNthCalledWith(
            2,
            1,
            CycleStage.PUBLISHED,
        );
    });

    it('swallows errors from the report generation pipeline', async () => {
        strategicReportingService.generateStrategicReportForCycle.mockRejectedValue(
            new Error('boom'),
        );

        const event = new CycleStageProcessedEvent(1, CycleStage.FINISHED);
        await expect(
            listener.handleCycleStageProcessed(event),
        ).resolves.toBeUndefined();

        // Only the first stage change happens before failure
        expect(cycleService.changeStage).toHaveBeenCalledWith(
            1,
            CycleStage.PREPARING_REPORT,
        );
        // PUBLISHED is never reached because generation threw
        expect(cycleService.changeStage).not.toHaveBeenCalledWith(
            1,
            CycleStage.PUBLISHED,
        );
    });
});
