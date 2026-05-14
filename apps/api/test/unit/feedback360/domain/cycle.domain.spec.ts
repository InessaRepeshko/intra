import { CYCLE_CONSTRAINTS, CycleStage } from '@intra/shared-kernel';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';

describe('CycleDomain', () => {
    const baseProps = {
        title: 'Q1 2025',
        hrId: 7,
        startDate: new Date('2025-01-01T00:00:00.000Z'),
        endDate: new Date('2025-03-31T00:00:00.000Z'),
    };

    describe('create', () => {
        it('creates a cycle with the supplied properties', () => {
            const cycle = CycleDomain.create({
                id: 1,
                ...baseProps,
                description: 'First cycle',
                stage: CycleStage.ACTIVE,
                isActive: true,
                minRespondentsThreshold: 8,
                reviewDeadline: new Date('2025-02-15T00:00:00.000Z'),
                approvalDeadline: new Date('2025-02-25T00:00:00.000Z'),
                responseDeadline: new Date('2025-03-15T00:00:00.000Z'),
                createdAt: new Date('2024-12-31T00:00:00.000Z'),
                updatedAt: new Date('2024-12-31T01:00:00.000Z'),
            });

            expect(cycle.id).toBe(1);
            expect(cycle.title).toBe('Q1 2025');
            expect(cycle.description).toBe('First cycle');
            expect(cycle.hrId).toBe(7);
            expect(cycle.stage).toBe(CycleStage.ACTIVE);
            expect(cycle.isActive).toBe(true);
            expect(cycle.minRespondentsThreshold).toBe(8);
            expect(cycle.startDate).toEqual(baseProps.startDate);
            expect(cycle.endDate).toEqual(baseProps.endDate);
            expect(cycle.reviewDeadline).toEqual(
                new Date('2025-02-15T00:00:00.000Z'),
            );
            expect(cycle.approvalDeadline).toEqual(
                new Date('2025-02-25T00:00:00.000Z'),
            );
            expect(cycle.responseDeadline).toEqual(
                new Date('2025-03-15T00:00:00.000Z'),
            );
            expect(cycle.createdAt).toEqual(
                new Date('2024-12-31T00:00:00.000Z'),
            );
            expect(cycle.updatedAt).toEqual(
                new Date('2024-12-31T01:00:00.000Z'),
            );
        });

        it('defaults the stage to NEW when not provided', () => {
            const cycle = CycleDomain.create(baseProps);
            expect(cycle.stage).toBe(CycleStage.NEW);
        });

        it('defaults isActive to true when not provided', () => {
            const cycle = CycleDomain.create(baseProps);
            expect(cycle.isActive).toBe(true);
        });

        it('defaults minRespondentsThreshold to the anonymity threshold minimum', () => {
            const cycle = CycleDomain.create(baseProps);
            expect(cycle.minRespondentsThreshold).toBe(
                CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN,
            );
        });

        it('normalises missing description and deadlines to null', () => {
            const cycle = CycleDomain.create(baseProps);
            expect(cycle.description).toBeNull();
            expect(cycle.reviewDeadline).toBeNull();
            expect(cycle.approvalDeadline).toBeNull();
            expect(cycle.responseDeadline).toBeNull();
        });

        it('preserves explicit null values for optional fields', () => {
            const cycle = CycleDomain.create({
                ...baseProps,
                description: null,
                reviewDeadline: null,
                approvalDeadline: null,
                responseDeadline: null,
            });

            expect(cycle.description).toBeNull();
            expect(cycle.reviewDeadline).toBeNull();
            expect(cycle.approvalDeadline).toBeNull();
            expect(cycle.responseDeadline).toBeNull();
        });

        it('omits id, createdAt and updatedAt when not provided', () => {
            const cycle = CycleDomain.create(baseProps);
            expect(cycle.id).toBeUndefined();
            expect(cycle.createdAt).toBeUndefined();
            expect(cycle.updatedAt).toBeUndefined();
        });
    });
});
