import { CommentSentiment, RespondentCategory } from '@intra/shared-kernel';
import { ReportCommentDomain } from 'src/contexts/reporting/domain/report-comment.domain';

describe('ReportCommentDomain', () => {
    const baseProps = {
        reportId: 1,
        questionId: 2,
        questionTitle: 'How is teamwork?',
        comment: 'Great collaboration',
        respondentCategories: [RespondentCategory.TEAM],
        numberOfMentions: 3,
    };

    describe('create', () => {
        it('creates a comment with all supplied fields', () => {
            const comment = ReportCommentDomain.create({
                id: 10,
                ...baseProps,
                commentSentiment: CommentSentiment.POSITIVE,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(comment.id).toBe(10);
            expect(comment.reportId).toBe(1);
            expect(comment.questionId).toBe(2);
            expect(comment.questionTitle).toBe('How is teamwork?');
            expect(comment.comment).toBe('Great collaboration');
            expect(comment.respondentCategories).toEqual([
                RespondentCategory.TEAM,
            ]);
            expect(comment.commentSentiment).toBe(CommentSentiment.POSITIVE);
            expect(comment.numberOfMentions).toBe(3);
            expect(comment.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('defaults respondentCategories to an empty array when null is passed', () => {
            const comment = ReportCommentDomain.create({
                ...baseProps,
                respondentCategories: null as any,
            });

            expect(comment.respondentCategories).toEqual([]);
        });

        it('defaults sentiment to null when missing', () => {
            const comment = ReportCommentDomain.create(baseProps);
            expect(comment.commentSentiment).toBeNull();
        });
    });
});
