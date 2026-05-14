import '../../../setup-env';

import { CycleStage, ReviewStage, SYSTEM_ACTOR } from '@intra/shared-kernel';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('CycleService (integration)', () => {
    let module: TestingModule;
    let service: CycleService;
    let reviews: ReviewRepository;
    let positions: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let hrId: number;
    let positionId: number;
    let rateeId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        service = module.get(CycleService);
        reviews = module.get(ReviewRepository);
        positions = module.get(PositionRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetFeedback360Tables(prisma);
        const hr = await identityUsers.create({
            firstName: 'Helena',
            lastName: 'Reed',
            email: `hr.${Date.now()}@example.com`,
        } as any);
        const ratee = await identityUsers.create({
            firstName: 'Robert',
            lastName: 'Smith',
            email: `ratee.${Date.now()}@example.com`,
        } as any);
        const position = await positions.create(
            PositionDomain.create({ title: 'Engineer' }),
        );

        hrId = hr.id!;
        rateeId = ratee.id!;
        positionId = position.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function basePayload(overrides: Partial<{ title: string }> = {}) {
        return {
            title: overrides.title ?? 'Q1 2026',
            description: 'A quarterly review cycle',
            hrId,
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-03-31'),
        } as any;
    }

    describe('create', () => {
        it('persists a cycle with stage NEW by default', async () => {
            const created = await service.create(basePayload());

            expect(created.id).toBeDefined();
            expect(created.stage).toBe(CycleStage.NEW);
            expect(created.isActive).toBe(true);
        });
    });

    describe('search / getById', () => {
        it('search returns persisted cycles', async () => {
            await service.create(basePayload({ title: 'Alpha' }));
            await service.create(basePayload({ title: 'Beta' }));

            const result = await service.search({} as any);

            expect(result).toHaveLength(2);
        });

        it('getById throws NotFoundException when missing', async () => {
            await expect(service.getById(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('persists patched scalar fields', async () => {
            const created = await service.create(basePayload());

            const updated = await service.update(created.id!, {
                description: 'updated',
            } as any);

            expect(updated.description).toBe('updated');
        });

        it('throws NotFoundException when the cycle is missing', async () => {
            await expect(
                service.update(999999, { description: 'x' } as any),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('transitions the stage via changeStage and writes history', async () => {
            const created = await service.create(basePayload());

            await service.update(created.id!, {
                stage: CycleStage.ACTIVE,
            } as any);

            const fromDb = await prisma.cycle.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.stage).toBe('ACTIVE');

            const history = await service.getStageHistory(created.id!);
            expect(history).toHaveLength(1);
            expect(history[0].fromStage).toBe(CycleStage.NEW);
            expect(history[0].toStage).toBe(CycleStage.ACTIVE);
        });

        it('rejects finishing a cycle while reviews are still in progress', async () => {
            const created = await service.create(basePayload());
            await service.update(created.id!, {
                stage: CycleStage.ACTIVE,
            } as any);

            await reviews.create(
                ReviewDomain.create({
                    rateeId,
                    rateeFullName: 'Robert Smith',
                    rateePositionId: positionId,
                    rateePositionTitle: 'Engineer',
                    hrId,
                    hrFullName: 'Helena Reed',
                    cycleId: created.id!,
                    stage: ReviewStage.IN_PROGRESS,
                }),
            );

            await expect(
                service.update(created.id!, {
                    stage: CycleStage.FINISHED,
                } as any),
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });

    describe('changeStage', () => {
        it('rejects an invalid transition', async () => {
            const created = await service.create(basePayload());

            await expect(
                service.changeStage(created.id!, CycleStage.PUBLISHED),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('persists the stage and emits a history record on a valid transition', async () => {
            const created = await service.create(basePayload());

            await service.changeStage(
                created.id!,
                CycleStage.ACTIVE,
                SYSTEM_ACTOR.ID,
                SYSTEM_ACTOR.NAME,
                'kicked off',
            );

            const reloaded = await service.getById(created.id!);
            expect(reloaded.stage).toBe(CycleStage.ACTIVE);

            const history = await service.getStageHistory(created.id!);
            expect(history).toHaveLength(1);
            expect(history[0].reason).toBe('kicked off');
        });
    });

    describe('completeCycle', () => {
        it('transitions an ACTIVE cycle to FINISHED when all reviews are complete', async () => {
            const created = await service.create(basePayload());
            await service.changeStage(created.id!, CycleStage.ACTIVE);

            await reviews.create(
                ReviewDomain.create({
                    rateeId,
                    rateeFullName: 'Robert Smith',
                    rateePositionId: positionId,
                    rateePositionTitle: 'Engineer',
                    hrId,
                    hrFullName: 'Helena Reed',
                    cycleId: created.id!,
                    stage: ReviewStage.FINISHED,
                }),
            );

            await service.completeCycle(created.id!);

            const reloaded = await service.getById(created.id!);
            expect(reloaded.stage).toBe(CycleStage.FINISHED);
        });

        it('throws BadRequestException when reviews are still in progress', async () => {
            const created = await service.create(basePayload());
            await service.changeStage(created.id!, CycleStage.ACTIVE);

            await reviews.create(
                ReviewDomain.create({
                    rateeId,
                    rateeFullName: 'Robert Smith',
                    rateePositionId: positionId,
                    rateePositionTitle: 'Engineer',
                    hrId,
                    hrFullName: 'Helena Reed',
                    cycleId: created.id!,
                    stage: ReviewStage.IN_PROGRESS,
                }),
            );

            await expect(
                service.completeCycle(created.id!),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('is a no-op when the cycle has no reviews at all', async () => {
            const created = await service.create(basePayload());
            await service.changeStage(created.id!, CycleStage.ACTIVE);

            await service.completeCycle(created.id!);

            const reloaded = await service.getById(created.id!);
            expect(reloaded.stage).toBe(CycleStage.ACTIVE);
        });
    });

    describe('forceFinish', () => {
        it('transitions ACTIVE -> FINISHED regardless of in-progress reviews', async () => {
            const created = await service.create(basePayload());
            await service.changeStage(created.id!, CycleStage.ACTIVE);

            await reviews.create(
                ReviewDomain.create({
                    rateeId,
                    rateeFullName: 'Robert Smith',
                    rateePositionId: positionId,
                    rateePositionTitle: 'Engineer',
                    hrId,
                    hrFullName: 'Helena Reed',
                    cycleId: created.id!,
                    stage: ReviewStage.IN_PROGRESS,
                }),
            );

            await service.forceFinish(created.id!);

            const reloaded = await service.getById(created.id!);
            expect(reloaded.stage).toBe(CycleStage.FINISHED);
        });
    });

    describe('delete', () => {
        it('removes the cycle row', async () => {
            const created = await service.create(basePayload());

            await service.delete(created.id!);

            const fromDb = await prisma.cycle.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });

        it('throws NotFoundException for a missing cycle', async () => {
            await expect(service.delete(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });
});
