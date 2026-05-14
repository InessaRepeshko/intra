jest.mock('better-auth', () => ({ betterAuth: jest.fn(() => ({})) }));
jest.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: jest.fn(() => ({})),
}));

import { CycleStage } from '@intra/shared-kernel';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { CyclesController } from 'src/contexts/feedback360/presentation/http/controllers/cycles.controller';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';

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

describe('CyclesController', () => {
    let controller: CyclesController;
    let cycles: any;

    beforeEach(() => {
        cycles = {
            create: jest.fn(),
            search: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            forceFinish: jest.fn(),
        };

        controller = new CyclesController(cycles as unknown as CycleService);
    });

    describe('create', () => {
        it('returns the response shape produced by the http mapper', async () => {
            cycles.create.mockResolvedValue(buildCycle());
            const dto = {
                title: 'Q1 2025',
                hrId: 7,
                startDate: new Date('2025-01-01T00:00:00.000Z'),
                endDate: new Date('2025-03-31T00:00:00.000Z'),
            } as any;

            const result = await controller.create(dto);

            expect(cycles.create).toHaveBeenCalledWith(dto);
            expect(result.id).toBe(1);
            expect(result.title).toBe('Q1 2025');
        });
    });

    describe('search', () => {
        it('maps every cycle to a response', async () => {
            cycles.search.mockResolvedValue([
                buildCycle({ id: 1 }),
                buildCycle({ id: 2 }),
            ]);

            const result = await controller.search({} as any);

            expect(cycles.search).toHaveBeenCalledWith({});
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe(1);
            expect(result[1].id).toBe(2);
        });
    });

    describe('getById', () => {
        it('parses the id as a number and forwards to the service', async () => {
            cycles.getById.mockResolvedValue(buildCycle({ id: 42 }));

            const result = await controller.getById('42');

            expect(cycles.getById).toHaveBeenCalledWith(42);
            expect(result.id).toBe(42);
        });
    });

    describe('update', () => {
        it('parses the id and forwards the patch', async () => {
            const updated = buildCycle({ stage: CycleStage.ACTIVE });
            cycles.update.mockResolvedValue(updated);

            const result = await controller.update('1', {
                stage: CycleStage.ACTIVE,
            } as any);

            expect(cycles.update).toHaveBeenCalledWith(1, {
                stage: CycleStage.ACTIVE,
            });
            expect(result.stage).toBe(CycleStage.ACTIVE);
        });
    });

    describe('delete', () => {
        it('parses the id and calls service.delete', async () => {
            await controller.delete('1');
            expect(cycles.delete).toHaveBeenCalledWith(1);
        });
    });

    describe('forceFinish', () => {
        it('passes actor id and full name to the service and returns the refreshed cycle', async () => {
            cycles.getById.mockResolvedValue(
                buildCycle({ stage: CycleStage.FINISHED }),
            );
            const actor = UserDomain.create({
                id: 9,
                firstName: 'HR',
                lastName: 'Admin',
                email: 'hr@example.com',
            });

            const result = await controller.forceFinish('1', actor);

            expect(cycles.forceFinish).toHaveBeenCalledWith(1, 9, 'HR Admin');
            expect(cycles.getById).toHaveBeenCalledWith(1);
            expect(result.stage).toBe(CycleStage.FINISHED);
        });
    });
});
