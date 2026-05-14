import { CycleStage, ReviewStage, SYSTEM_ACTOR } from '@intra/shared-kernel';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { TRANSITION_REASONS } from 'src/contexts/feedback360/application/constants/cycle-stage-transitions';
import { CycleStageChangedEvent } from 'src/contexts/feedback360/application/events/cycle-stage-changed.event';
import { CYCLE_STAGE_HISTORY_REPOSITORY } from 'src/contexts/feedback360/application/ports/cycle-stage-history.repository.port';
import { CYCLE_REPOSITORY } from 'src/contexts/feedback360/application/ports/cycle.repository.port';
import { REVIEW_REPOSITORY } from 'src/contexts/feedback360/application/ports/review.repository.port';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { STRATEGIC_REPORT_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report.repository.port';
import { PrismaService } from 'src/database/prisma.service';

type Mocked<T> = { [K in keyof T]: jest.Mock };

function buildCycle(
    overrides: Partial<Parameters<typeof CycleDomain.create>[0]> = {},
): CycleDomain {
    return CycleDomain.create({
        id: 1,
        title: 'Q1 2025',
        hrId: 7,
        startDate: new Date('2025-01-01T00:00:00.000Z'),
        endDate: new Date('2025-03-31T00:00:00.000Z'),
        ...overrides,
    });
}

function buildReview(
    overrides: Partial<Parameters<typeof ReviewDomain.create>[0]> = {},
): ReviewDomain {
    return ReviewDomain.create({
        id: 1,
        rateeId: 1,
        rateeFullName: 'Ratee',
        rateePositionId: 1,
        rateePositionTitle: 'Engineer',
        hrId: 2,
        hrFullName: 'HR',
        cycleId: 1,
        ...overrides,
    });
}

describe('CycleService', () => {
    let service: CycleService;
    let cycles: Mocked<{
        create: jest.Mock;
        search: jest.Mock;
        findById: jest.Mock;
        updateById: jest.Mock;
        deleteById: jest.Mock;
    }>;
    let stageHistory: Mocked<{ create: jest.Mock; findByCycleId: jest.Mock }>;
    let reviews: Mocked<{ listByCycleId: jest.Mock }>;
    let strategicReports: Mocked<{ findByCycleId: jest.Mock }>;
    let prisma: { $transaction: jest.Mock };
    let eventEmitter: { emit: jest.Mock };
    let txUpdate: jest.Mock;

    beforeEach(async () => {
        cycles = {
            create: jest.fn(),
            search: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
        };
        stageHistory = {
            create: jest.fn(),
            findByCycleId: jest.fn(),
        };
        reviews = { listByCycleId: jest.fn() };
        strategicReports = { findByCycleId: jest.fn() };
        eventEmitter = { emit: jest.fn() };
        txUpdate = jest.fn();
        prisma = {
            $transaction: jest.fn(async (cb) =>
                cb({ cycle: { update: txUpdate } }),
            ),
        };

        const module = await Test.createTestingModule({
            providers: [
                CycleService,
                { provide: CYCLE_REPOSITORY, useValue: cycles },
                {
                    provide: CYCLE_STAGE_HISTORY_REPOSITORY,
                    useValue: stageHistory,
                },
                { provide: REVIEW_REPOSITORY, useValue: reviews },
                {
                    provide: STRATEGIC_REPORT_REPOSITORY,
                    useValue: strategicReports,
                },
                { provide: EventEmitter2, useValue: eventEmitter },
                { provide: PrismaService, useValue: prisma },
            ],
        }).compile();

        service = module.get(CycleService);
    });

    describe('create', () => {
        it('creates a cycle and then returns it via getById', async () => {
            const created = buildCycle();
            cycles.create.mockResolvedValue(created);
            cycles.findById.mockResolvedValue(created);

            const result = await service.create({
                title: 'Q1 2025',
                hrId: 7,
                startDate: created.startDate,
                endDate: created.endDate,
            });

            expect(cycles.create).toHaveBeenCalledTimes(1);
            const passed = cycles.create.mock.calls[0][0] as CycleDomain;
            expect(passed).toBeInstanceOf(CycleDomain);
            expect(passed.stage).toBe(CycleStage.NEW);
            expect(passed.isActive).toBe(true);
            expect(cycles.findById).toHaveBeenCalledWith(created.id);
            expect(result).toBe(created);
        });

        it('uses payload values for stage, isActive and minRespondentsThreshold when provided', async () => {
            const created = buildCycle({ stage: CycleStage.ACTIVE });
            cycles.create.mockResolvedValue(created);
            cycles.findById.mockResolvedValue(created);

            await service.create({
                title: 'X',
                hrId: 1,
                stage: CycleStage.ACTIVE,
                isActive: false,
                minRespondentsThreshold: 9,
                startDate: created.startDate,
                endDate: created.endDate,
            });

            const passed = cycles.create.mock.calls[0][0] as CycleDomain;
            expect(passed.stage).toBe(CycleStage.ACTIVE);
            expect(passed.isActive).toBe(false);
            expect(passed.minRespondentsThreshold).toBe(9);
        });
    });

    describe('search', () => {
        it('delegates to the cycle repository', async () => {
            const result = [buildCycle()];
            cycles.search.mockResolvedValue(result);

            const out = await service.search({ isActive: true });
            expect(cycles.search).toHaveBeenCalledWith({ isActive: true });
            expect(out).toBe(result);
        });
    });

    describe('getById', () => {
        it('returns the cycle when found', async () => {
            const cycle = buildCycle();
            cycles.findById.mockResolvedValue(cycle);
            await expect(service.getById(1)).resolves.toBe(cycle);
        });

        it('throws NotFoundException when missing', async () => {
            cycles.findById.mockResolvedValue(null);
            await expect(service.getById(99)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('blocks title changes when a strategic report exists', async () => {
            const cycle = buildCycle();
            cycles.findById.mockResolvedValue(cycle);
            strategicReports.findByCycleId.mockResolvedValue({ id: 5 });

            await expect(
                service.update(1, { title: 'new title' }),
            ).rejects.toBeInstanceOf(BadRequestException);
            expect(cycles.updateById).not.toHaveBeenCalled();
        });

        it('forwards only defined patch fields to updateById', async () => {
            const cycle = buildCycle();
            cycles.findById.mockResolvedValue(cycle);
            strategicReports.findByCycleId.mockResolvedValue(null);
            cycles.updateById.mockResolvedValue({
                ...cycle,
                description: 'desc',
            });

            await service.update(1, { description: 'desc' });

            expect(cycles.updateById).toHaveBeenCalledWith(1, {
                description: 'desc',
            });
        });

        it('blocks stage transition to FINISHED when reviews are still active', async () => {
            const cycle = buildCycle({ stage: CycleStage.ACTIVE });
            cycles.findById.mockResolvedValue(cycle);
            strategicReports.findByCycleId.mockResolvedValue(null);
            cycles.updateById.mockResolvedValue(cycle);
            reviews.listByCycleId.mockResolvedValue([
                buildReview({ stage: ReviewStage.IN_PROGRESS }),
            ]);

            await expect(
                service.update(1, { stage: CycleStage.FINISHED }),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('runs completeCycle when patching to FINISHED with no active reviews', async () => {
            const cycle = buildCycle({ stage: CycleStage.ACTIVE });
            cycles.findById.mockResolvedValue(cycle);
            strategicReports.findByCycleId.mockResolvedValue(null);
            cycles.updateById.mockResolvedValue(cycle);
            reviews.listByCycleId.mockResolvedValue([
                buildReview({ stage: ReviewStage.FINISHED }),
            ]);

            await service.update(1, { stage: CycleStage.FINISHED });

            // Stage transition happens via $transaction
            expect(prisma.$transaction).toHaveBeenCalled();
            expect(txUpdate).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { stage: CycleStage.FINISHED },
            });
            expect(eventEmitter.emit).toHaveBeenCalledWith(
                'cycle.stage.changed',
                expect.any(CycleStageChangedEvent),
            );
        });

        it('skips changeStage when patch.stage equals current stage', async () => {
            const cycle = buildCycle({ stage: CycleStage.ACTIVE });
            cycles.findById.mockResolvedValue(cycle);
            strategicReports.findByCycleId.mockResolvedValue(null);
            cycles.updateById.mockResolvedValue(cycle);

            await service.update(1, { stage: CycleStage.ACTIVE });

            expect(prisma.$transaction).not.toHaveBeenCalled();
            expect(eventEmitter.emit).not.toHaveBeenCalled();
        });

        it('does not call changeStage when target stage is PUBLISHED', async () => {
            const cycle = buildCycle({ stage: CycleStage.PREPARING_REPORT });
            cycles.findById.mockResolvedValue(cycle);
            strategicReports.findByCycleId.mockResolvedValue(null);
            cycles.updateById.mockResolvedValue(cycle);
            reviews.listByCycleId.mockResolvedValue([]);

            await service.update(1, { stage: CycleStage.PUBLISHED });

            expect(prisma.$transaction).not.toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('throws NotFoundException when cycle is missing', async () => {
            cycles.findById.mockResolvedValue(null);
            await expect(service.delete(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
            expect(cycles.deleteById).not.toHaveBeenCalled();
        });

        it('deletes the cycle when it exists', async () => {
            cycles.findById.mockResolvedValue(buildCycle());
            await service.delete(1);
            expect(cycles.deleteById).toHaveBeenCalledWith(1);
        });
    });

    describe('changeStage', () => {
        it('throws on an invalid transition', async () => {
            const cycle = buildCycle({ stage: CycleStage.ARCHIVED });
            cycles.findById.mockResolvedValue(cycle);

            await expect(
                service.changeStage(1, CycleStage.ACTIVE),
            ).rejects.toBeInstanceOf(BadRequestException);
            expect(prisma.$transaction).not.toHaveBeenCalled();
        });

        it('updates the stage, writes a history record, and emits the event', async () => {
            const cycle = buildCycle({ stage: CycleStage.NEW });
            cycles.findById.mockResolvedValue(cycle);

            await service.changeStage(
                1,
                CycleStage.ACTIVE,
                10,
                'Actor',
                'unit test reason',
            );

            expect(prisma.$transaction).toHaveBeenCalledTimes(1);
            expect(txUpdate).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { stage: CycleStage.ACTIVE },
            });
            expect(stageHistory.create).toHaveBeenCalledTimes(1);
            const history = stageHistory.create.mock.calls[0][0];
            expect(history.cycleId).toBe(1);
            expect(history.fromStage).toBe(CycleStage.NEW);
            expect(history.toStage).toBe(CycleStage.ACTIVE);
            expect(history.changedById).toBe(10);
            expect(history.changedByName).toBe('Actor');
            expect(history.reason).toBe('unit test reason');

            expect(eventEmitter.emit).toHaveBeenCalledWith(
                'cycle.stage.changed',
                expect.objectContaining({
                    cycleId: 1,
                    fromStage: CycleStage.NEW,
                    toStage: CycleStage.ACTIVE,
                    changedById: 10,
                    changedByName: 'Actor',
                    reason: 'unit test reason',
                }),
            );
        });

        it('uses SYSTEM_ACTOR defaults when actor information is omitted', async () => {
            const cycle = buildCycle({ stage: CycleStage.NEW });
            cycles.findById.mockResolvedValue(cycle);

            await service.changeStage(1, CycleStage.ACTIVE);

            const history = stageHistory.create.mock.calls[0][0];
            expect(history.changedById).toBeNull(); // 0 || null
            expect(history.changedByName).toBe(SYSTEM_ACTOR.NAME);
        });
    });

    describe('completeCycle', () => {
        it('moves the cycle to FINISHED when all reviews are non-active', async () => {
            const cycle = buildCycle({ stage: CycleStage.ACTIVE });
            cycles.findById.mockResolvedValue(cycle);
            reviews.listByCycleId.mockResolvedValue([
                buildReview({ stage: ReviewStage.FINISHED }),
                buildReview({ stage: ReviewStage.PUBLISHED }),
            ]);

            await service.completeCycle(1);

            expect(txUpdate).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { stage: CycleStage.FINISHED },
            });
            const event = eventEmitter.emit.mock.calls[0][1];
            expect(event.toStage).toBe(CycleStage.FINISHED);
            expect(event.reason).toBe(
                TRANSITION_REASONS.ALL_REVIEWS_COLLECTED,
            );
        });

        it('throws when at least one review is still IN_PROGRESS', async () => {
            const cycle = buildCycle({ stage: CycleStage.ACTIVE });
            cycles.findById.mockResolvedValue(cycle);
            reviews.listByCycleId.mockResolvedValue([
                buildReview({ stage: ReviewStage.IN_PROGRESS }),
            ]);

            await expect(service.completeCycle(1)).rejects.toBeInstanceOf(
                BadRequestException,
            );
        });

        it('does nothing when there are no reviews', async () => {
            const cycle = buildCycle({ stage: CycleStage.ACTIVE });
            cycles.findById.mockResolvedValue(cycle);
            reviews.listByCycleId.mockResolvedValue([]);

            await service.completeCycle(1);

            expect(prisma.$transaction).not.toHaveBeenCalled();
            expect(eventEmitter.emit).not.toHaveBeenCalled();
        });
    });

    describe('forceFinish', () => {
        it('transitions the cycle to FINISHED with the FORCE_FINISH reason', async () => {
            const cycle = buildCycle({ stage: CycleStage.ACTIVE });
            cycles.findById.mockResolvedValue(cycle);

            await service.forceFinish(1, 8, 'HR Admin');

            const history = stageHistory.create.mock.calls[0][0];
            expect(history.toStage).toBe(CycleStage.FINISHED);
            expect(history.reason).toBe(TRANSITION_REASONS.FORCE_FINISH);
            expect(history.changedById).toBe(8);
            expect(history.changedByName).toBe('HR Admin');
        });
    });

    describe('getStageHistory', () => {
        it('delegates to the stageHistory repository', async () => {
            stageHistory.findByCycleId.mockResolvedValue([{ id: 1 }]);
            const result = await service.getStageHistory(42);
            expect(stageHistory.findByCycleId).toHaveBeenCalledWith(42);
            expect(result).toEqual([{ id: 1 }]);
        });
    });
});
