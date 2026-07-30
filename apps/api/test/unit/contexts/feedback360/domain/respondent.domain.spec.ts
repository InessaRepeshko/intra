import { RespondentCategory, ResponseStatus } from '@intra/shared-kernel';
import { RespondentDomain } from 'src/contexts/feedback360/domain/respondent.domain';

describe('RespondentDomain', () => {
    const baseProps = {
        reviewId: 1,
        respondentId: 2,
        fullName: 'John Smith',
        category: RespondentCategory.TEAM,
        positionId: 3,
        positionTitle: 'Engineer',
    };

    describe('create', () => {
        it('creates a respondent with all supplied properties', () => {
            const respondent = RespondentDomain.create({
                id: 1,
                ...baseProps,
                responseStatus: ResponseStatus.IN_PROGRESS,
                respondentNote: 'feedback note',
                hrNote: 'hr note',
                teamId: 5,
                teamTitle: 'Team A',
                invitedAt: new Date('2025-01-01T00:00:00.000Z'),
                canceledAt: new Date('2025-01-02T00:00:00.000Z'),
                respondedAt: new Date('2025-01-03T00:00:00.000Z'),
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-04T00:00:00.000Z'),
            });

            expect(respondent.id).toBe(1);
            expect(respondent.reviewId).toBe(1);
            expect(respondent.respondentId).toBe(2);
            expect(respondent.fullName).toBe('John Smith');
            expect(respondent.category).toBe(RespondentCategory.TEAM);
            expect(respondent.responseStatus).toBe(ResponseStatus.IN_PROGRESS);
            expect(respondent.respondentNote).toBe('feedback note');
            expect(respondent.hrNote).toBe('hr note');
            expect(respondent.teamId).toBe(5);
            expect(respondent.teamTitle).toBe('Team A');
            expect(respondent.invitedAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(respondent.canceledAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
            expect(respondent.respondedAt).toEqual(
                new Date('2025-01-03T00:00:00.000Z'),
            );
        });

        it('defaults responseStatus to PENDING when not provided', () => {
            const respondent = RespondentDomain.create(baseProps);
            expect(respondent.responseStatus).toBe(ResponseStatus.PENDING);
        });

        it('normalises missing optional fields to null', () => {
            const respondent = RespondentDomain.create(baseProps);

            expect(respondent.respondentNote).toBeNull();
            expect(respondent.hrNote).toBeNull();
            expect(respondent.teamId).toBeNull();
            expect(respondent.teamTitle).toBeNull();
            expect(respondent.invitedAt).toBeNull();
            expect(respondent.canceledAt).toBeNull();
            expect(respondent.respondedAt).toBeNull();
        });
    });
});
