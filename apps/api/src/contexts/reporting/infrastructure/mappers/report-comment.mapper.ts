import {
    Prisma,
    CommentSentiment as PrismaCommentSentiment,
    ReportComment as PrismaReportComment,
    RespondentCategory as PrismaRespondentCategory,
} from '@intra/database';
import { CommentSentiment, RespondentCategory } from '@intra/shared-kernel';
import { ReportCommentDomain } from '../../domain/report-comment.domain';

export class ReportCommentMapper {
    static toDomain(comment: PrismaReportComment): ReportCommentDomain {
        return ReportCommentDomain.create({
            id: comment.id,
            reportId: comment.reportId,
            questionId: comment.questionId,
            questionTitle: comment.questionTitle,
            comment: comment.comment,
            respondentCategories:
                ReportCommentMapper.toDomainRespondentCategories(
                    comment.respondentCategories,
                ),
            commentSentiment: ReportCommentMapper.toDomainCommentSentiment(
                comment.commentSentiment,
            ),
            numberOfMentions: comment.numberOfMentions,
            createdAt: comment.createdAt,
        });
    }

    static toPrisma(
        comment: ReportCommentDomain,
    ): Prisma.ReportCommentUncheckedCreateInput {
        return {
            reportId: comment.reportId,
            questionId: comment.questionId,
            questionTitle: comment.questionTitle,
            comment: comment.comment,
            respondentCategories: comment.respondentCategories,
            commentSentiment: ReportCommentMapper.toPrismaCommentSentiment(
                comment.commentSentiment,
            ),
            numberOfMentions: comment.numberOfMentions,
        };
    }

    static toDomainRespondentCategories(
        respondentCategories: PrismaRespondentCategory[],
    ): RespondentCategory[] {
        return respondentCategories.map(
            (c) => c.toString().toUpperCase() as RespondentCategory,
        );
    }

    static toPrismaCommentSentiment(
        domainSentiment: CommentSentiment | null | undefined,
    ): PrismaCommentSentiment | undefined {
        if (!domainSentiment) {
            return undefined;
        }
        return domainSentiment
            .toString()
            .toUpperCase() as PrismaCommentSentiment;
    }

    static toDomainCommentSentiment(
        prismaSentiment: PrismaCommentSentiment | null,
    ): CommentSentiment | undefined {
        if (!prismaSentiment) {
            return undefined;
        }
        return prismaSentiment.toString().toUpperCase() as CommentSentiment;
    }
}
