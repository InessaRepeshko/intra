import { RespondentCategory, ResponseStatus } from '@intra/shared-kernel';
import { RespondentDomain } from 'src/contexts/feedback360/domain/respondent.domain';
import { RespondentHttpMapper } from 'src/contexts/feedback360/presentation/http/mappers/respondent.http.mapper';

describe('RespondentHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response', () => {
            const domain = RespondentDomain.create({
                id: 1,
                reviewId: 10,
                respondentId: 20,
                fullName: 'John Smith',
                category: RespondentCategory.TEAM,
                responseStatus: ResponseStatus.IN_PROGRESS,
                respondentNote: 'note',
                hrNote: 'hr note',
                positionId: 3,
                positionTitle: 'Engineer',
                teamId: 4,
                teamTitle: 'Team A',
                invitedAt: new Date('2025-01-01T00:00:00.000Z'),
                canceledAt: new Date('2025-01-02T00:00:00.000Z'),
                respondedAt: new Date('2025-01-03T00:00:00.000Z'),
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-04T00:00:00.000Z'),
            });

            const response = RespondentHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.fullName).toBe('John Smith');
            expect(response.category).toBe(RespondentCategory.TEAM);
            expect(response.responseStatus).toBe(ResponseStatus.IN_PROGRESS);
            expect(response.respondentNote).toBe('note');
            expect(response.hrNote).toBe('hr note');
            expect(response.teamId).toBe(4);
            expect(response.teamTitle).toBe('Team A');
            expect(response.invitedAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('returns null for missing optional fields', () => {
            const domain = RespondentDomain.create({
                reviewId: 1,
                respondentId: 2,
                fullName: 'X',
                category: RespondentCategory.OTHER,
                positionId: 1,
                positionTitle: 'Eng',
            });

            const response = RespondentHttpMapper.toResponse(domain);

            expect(response.respondentNote).toBeNull();
            expect(response.hrNote).toBeNull();
            expect(response.teamId).toBeNull();
            expect(response.teamTitle).toBeNull();
            expect(response.invitedAt).toBeNull();
            expect(response.canceledAt).toBeNull();
            expect(response.respondedAt).toBeNull();
        });
    });
});
