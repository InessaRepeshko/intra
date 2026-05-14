import { CycleStage } from '@intra/shared-kernel';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { CycleHttpMapper } from 'src/contexts/feedback360/presentation/http/mappers/cycle.http.mapper';
import { CycleResponse } from 'src/contexts/feedback360/presentation/http/models/cycle.response';

describe('CycleHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response', () => {
            const domain = CycleDomain.create({
                id: 1,
                title: 'Q1 2025',
                description: 'First cycle',
                hrId: 7,
                minRespondentsThreshold: 5,
                stage: CycleStage.ACTIVE,
                isActive: true,
                startDate: new Date('2025-01-01T00:00:00.000Z'),
                reviewDeadline: new Date('2025-02-01T00:00:00.000Z'),
                approvalDeadline: new Date('2025-02-15T00:00:00.000Z'),
                responseDeadline: new Date('2025-03-01T00:00:00.000Z'),
                endDate: new Date('2025-03-31T00:00:00.000Z'),
                createdAt: new Date('2024-12-31T00:00:00.000Z'),
                updatedAt: new Date('2024-12-31T01:00:00.000Z'),
            });

            const response = CycleHttpMapper.toResponse(domain);

            expect(response).toBeInstanceOf(CycleResponse);
            expect(response.id).toBe(1);
            expect(response.title).toBe('Q1 2025');
            expect(response.description).toBe('First cycle');
            expect(response.hrId).toBe(7);
            expect(response.minRespondentsThreshold).toBe(5);
            expect(response.stage).toBe(CycleStage.ACTIVE);
            expect(response.isActive).toBe(true);
            expect(response.startDate).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(response.reviewDeadline).toEqual(
                new Date('2025-02-01T00:00:00.000Z'),
            );
            expect(response.approvalDeadline).toEqual(
                new Date('2025-02-15T00:00:00.000Z'),
            );
            expect(response.responseDeadline).toEqual(
                new Date('2025-03-01T00:00:00.000Z'),
            );
            expect(response.endDate).toEqual(
                new Date('2025-03-31T00:00:00.000Z'),
            );
            expect(response.createdAt).toEqual(
                new Date('2024-12-31T00:00:00.000Z'),
            );
            expect(response.updatedAt).toEqual(
                new Date('2024-12-31T01:00:00.000Z'),
            );
        });

        it('emits explicit null values for missing optional fields', () => {
            const domain = CycleDomain.create({
                id: 2,
                title: 'Minimal',
                hrId: 1,
                startDate: new Date('2025-01-01T00:00:00.000Z'),
                endDate: new Date('2025-12-31T00:00:00.000Z'),
            });

            const response = CycleHttpMapper.toResponse(domain);

            expect(response.description).toBeNull();
            expect(response.reviewDeadline).toBeNull();
            expect(response.approvalDeadline).toBeNull();
            expect(response.responseDeadline).toBeNull();
        });
    });
});
