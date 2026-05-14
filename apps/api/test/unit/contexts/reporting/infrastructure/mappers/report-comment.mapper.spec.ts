import { ReportComment as PrismaReportComment } from '@intra/database';
import { CommentSentiment, RespondentCategory } from '@intra/shared-kernel';
import { ReportCommentDomain } from 'src/contexts/reporting/domain/report-comment.domain';
import { ReportCommentMapper } from 'src/contexts/reporting/infrastructure/mappers/report-comment.mapper';

describe('ReportCommentMapper', () => {
    const prismaRow = {
        id: 1,
        reportId: 10,
        questionId: 20,
        questionTitle: 'How is teamwork?',
        comment: 'Great collaboration',
        respondentCategories: [
            'TEAM',
        ] as PrismaReportComment['respondentCategories'],
        commentSentiment: 'POSITIVE' as PrismaReportComment['commentSentiment'],
        numberOfMentions: 3,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as PrismaReportComment;

    describe('toDomain', () => {
        it('converts a prisma row into a ReportCommentDomain', () => {
            const domain = ReportCommentMapper.toDomain(prismaRow);

            expect(domain).toBeInstanceOf(ReportCommentDomain);
            expect(domain.id).toBe(1);
            expect(domain.reportId).toBe(10);
            expect(domain.questionId).toBe(20);
            expect(domain.comment).toBe('Great collaboration');
            expect(domain.respondentCategories).toEqual([
                RespondentCategory.TEAM,
            ]);
            expect(domain.commentSentiment).toBe(CommentSentiment.POSITIVE);
        });

        it('falls back commentSentiment to null when prisma returns null', () => {
            const domain = ReportCommentMapper.toDomain({
                ...prismaRow,
                commentSentiment: null,
            } as unknown as PrismaReportComment);
            expect(domain.commentSentiment).toBeNull();
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain object into a Prisma create input', () => {
            const domain = ReportCommentDomain.create({
                reportId: 10,
                questionId: 20,
                questionTitle: 'Q?',
                comment: 'Nice',
                respondentCategories: [RespondentCategory.TEAM],
                commentSentiment: CommentSentiment.NEGATIVE,
                numberOfMentions: 4,
            });

            const prisma = ReportCommentMapper.toPrisma(domain);

            expect(prisma.reportId).toBe(10);
            expect(prisma.questionId).toBe(20);
            expect(prisma.questionTitle).toBe('Q?');
            expect(prisma.comment).toBe('Nice');
            expect(prisma.commentSentiment).toBe('NEGATIVE');
            expect(prisma.numberOfMentions).toBe(4);
        });

        it('returns undefined sentiment when domain sentiment is null', () => {
            const domain = ReportCommentDomain.create({
                reportId: 10,
                questionId: 20,
                questionTitle: 'Q?',
                comment: 'Nice',
                respondentCategories: [RespondentCategory.TEAM],
                numberOfMentions: 4,
            });

            const prisma = ReportCommentMapper.toPrisma(domain);
            expect(prisma.commentSentiment).toBeUndefined();
        });
    });

    describe('enum conversions', () => {
        it('uppercases respondentCategories in toDomain', () => {
            expect(
                ReportCommentMapper.toDomainRespondentCategories([
                    'OTHER',
                ] as PrismaReportComment['respondentCategories']),
            ).toEqual([RespondentCategory.OTHER]);
        });

        it('uppercases sentiment in both directions', () => {
            expect(
                ReportCommentMapper.toPrismaCommentSentiment(
                    CommentSentiment.POSITIVE,
                ),
            ).toBe('POSITIVE');
            expect(
                ReportCommentMapper.toDomainCommentSentiment(
                    'NEGATIVE' as PrismaReportComment['commentSentiment'],
                ),
            ).toBe(CommentSentiment.NEGATIVE);
            expect(
                ReportCommentMapper.toPrismaCommentSentiment(null),
            ).toBeUndefined();
            expect(
                ReportCommentMapper.toDomainCommentSentiment(null),
            ).toBeUndefined();
        });
    });
});
