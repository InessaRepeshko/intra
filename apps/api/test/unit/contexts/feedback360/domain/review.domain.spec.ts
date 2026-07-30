import { ReviewStage } from '@intra/shared-kernel';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';

describe('ReviewDomain', () => {
    const baseProps = {
        rateeId: 11,
        rateeFullName: 'Jane Doe',
        rateePositionId: 3,
        rateePositionTitle: 'Engineer',
        hrId: 2,
        hrFullName: 'HR Manager',
    };

    describe('create', () => {
        it('creates a review with all supplied properties', () => {
            const review = ReviewDomain.create({
                id: 100,
                ...baseProps,
                hrNote: 'note',
                teamId: 4,
                teamTitle: 'Team A',
                managerId: 5,
                managerFullName: 'Manager Name',
                managerPositionId: 6,
                managerPositionTitle: 'Engineering Lead',
                cycleId: 50,
                stage: ReviewStage.IN_PROGRESS,
                reportId: 99,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-01T01:00:00.000Z'),
            });

            expect(review.id).toBe(100);
            expect(review.rateeId).toBe(11);
            expect(review.rateeFullName).toBe('Jane Doe');
            expect(review.rateePositionId).toBe(3);
            expect(review.rateePositionTitle).toBe('Engineer');
            expect(review.hrId).toBe(2);
            expect(review.hrFullName).toBe('HR Manager');
            expect(review.hrNote).toBe('note');
            expect(review.teamId).toBe(4);
            expect(review.teamTitle).toBe('Team A');
            expect(review.managerId).toBe(5);
            expect(review.managerFullName).toBe('Manager Name');
            expect(review.managerPositionId).toBe(6);
            expect(review.managerPositionTitle).toBe('Engineering Lead');
            expect(review.cycleId).toBe(50);
            expect(review.stage).toBe(ReviewStage.IN_PROGRESS);
            expect(review.reportId).toBe(99);
            expect(review.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(review.updatedAt).toEqual(
                new Date('2025-01-01T01:00:00.000Z'),
            );
        });

        it('defaults the stage to NEW when not provided', () => {
            const review = ReviewDomain.create(baseProps);
            expect(review.stage).toBe(ReviewStage.NEW);
        });

        it('normalises missing optional fields to null', () => {
            const review = ReviewDomain.create(baseProps);
            expect(review.hrNote).toBeNull();
            expect(review.teamId).toBeNull();
            expect(review.teamTitle).toBeNull();
            expect(review.managerId).toBeNull();
            expect(review.managerFullName).toBeNull();
            expect(review.managerPositionId).toBeNull();
            expect(review.managerPositionTitle).toBeNull();
            expect(review.cycleId).toBeNull();
            expect(review.reportId).toBeNull();
        });

        it('preserves explicit null values for optional fields', () => {
            const review = ReviewDomain.create({
                ...baseProps,
                hrNote: null,
                teamId: null,
                teamTitle: null,
                managerId: null,
                managerFullName: null,
                managerPositionId: null,
                managerPositionTitle: null,
                cycleId: null,
                reportId: null,
            });

            expect(review.hrNote).toBeNull();
            expect(review.cycleId).toBeNull();
            expect(review.reportId).toBeNull();
            expect(review.managerId).toBeNull();
        });
    });
});
