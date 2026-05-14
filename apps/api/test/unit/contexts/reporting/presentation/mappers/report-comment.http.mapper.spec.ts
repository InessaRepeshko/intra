import { CommentSentiment, RespondentCategory } from '@intra/shared-kernel';
import { ReportCommentDomain } from 'src/contexts/reporting/domain/report-comment.domain';
import { ReportCommentHttpMapper } from 'src/contexts/reporting/presentation/http/mappers/report-comment.http.mapper';

describe('ReportCommentHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response', () => {
            const domain = ReportCommentDomain.create({
                id: 1,
                reportId: 10,
                questionId: 20,
                questionTitle: 'How is teamwork?',
                comment: 'Great collaboration',
                respondentCategories: [RespondentCategory.TEAM],
                commentSentiment: CommentSentiment.POSITIVE,
                numberOfMentions: 3,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            const response = ReportCommentHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.reportId).toBe(10);
            expect(response.questionId).toBe(20);
            expect(response.questionTitle).toBe('How is teamwork?');
            expect(response.comment).toBe('Great collaboration');
            expect(response.respondentCategories).toEqual([
                RespondentCategory.TEAM,
            ]);
            expect(response.commentSentiment).toBe(CommentSentiment.POSITIVE);
            expect(response.numberOfMentions).toBe(3);
            expect(response.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('returns null sentiment when none is set on the domain', () => {
            const domain = ReportCommentDomain.create({
                reportId: 10,
                questionId: 20,
                questionTitle: 'Q?',
                comment: 'X',
                respondentCategories: [RespondentCategory.TEAM],
                numberOfMentions: 1,
            });

            const response = ReportCommentHttpMapper.toResponse(domain);
            expect(response.commentSentiment).toBeNull();
        });
    });
});
