import { ReviewStage } from '@intra/shared-kernel';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { ReviewHttpMapper } from 'src/contexts/feedback360/presentation/http/mappers/review.http.mapper';
import { ReviewResponse } from 'src/contexts/feedback360/presentation/http/models/review.response';

describe('ReviewHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response', () => {
            const domain = ReviewDomain.create({
                id: 100,
                rateeId: 11,
                rateeFullName: 'Jane Doe',
                rateePositionId: 3,
                rateePositionTitle: 'Engineer',
                hrId: 2,
                hrFullName: 'HR Manager',
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

            const response = ReviewHttpMapper.toResponse(domain);

            expect(response).toBeInstanceOf(ReviewResponse);
            expect(response.id).toBe(100);
            expect(response.rateeId).toBe(11);
            expect(response.rateeFullName).toBe('Jane Doe');
            expect(response.hrId).toBe(2);
            expect(response.hrFullName).toBe('HR Manager');
            expect(response.hrNote).toBe('note');
            expect(response.teamId).toBe(4);
            expect(response.managerId).toBe(5);
            expect(response.cycleId).toBe(50);
            expect(response.stage).toBe(ReviewStage.IN_PROGRESS);
            expect(response.reportId).toBe(99);
        });

        it('emits explicit null for missing optional relations', () => {
            const domain = ReviewDomain.create({
                id: 1,
                rateeId: 1,
                rateeFullName: 'Jane Doe',
                rateePositionId: 1,
                rateePositionTitle: 'Engineer',
                hrId: 2,
                hrFullName: 'HR Manager',
            });

            const response = ReviewHttpMapper.toResponse(domain);

            expect(response.hrNote).toBeNull();
            expect(response.teamId).toBeNull();
            expect(response.teamTitle).toBeNull();
            expect(response.managerId).toBeNull();
            expect(response.managerFullName).toBeNull();
            expect(response.managerPositionId).toBeNull();
            expect(response.managerPositionTitle).toBeNull();
            expect(response.cycleId).toBeNull();
            expect(response.reportId).toBeNull();
        });
    });
});
