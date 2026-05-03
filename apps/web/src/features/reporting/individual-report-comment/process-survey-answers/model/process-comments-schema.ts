import { RespondentCategory } from '@entities/feedback360/answer/model/types';
import {
    CommentSentiment,
    REPORT_COMMENT_CONSTRAINTS,
} from '@intra/shared-kernel';
import { z } from 'zod';

const reportCommentEntrySchema = z.object({
    questionId: z.coerce.number().int().positive(),
    answerId: z.coerce.number().int().positive(),
    questionTitle: z.string().min(1),
    respondentCategory: z.nativeEnum(RespondentCategory),
    comment: z
        .string()
        .trim()
        .min(
            REPORT_COMMENT_CONSTRAINTS.COMMENT.LENGTH.MIN,
            'Please provide a comment',
        )
        .max(
            REPORT_COMMENT_CONSTRAINTS.COMMENT.LENGTH.MAX,
            `Comment must be at most ${REPORT_COMMENT_CONSTRAINTS.COMMENT.LENGTH.MAX} characters`,
        ),
    commentSentiment: z.nativeEnum(CommentSentiment, {
        message: 'Please select sentiment',
    }),
});

export const processReportCommentsSchema = z.object({
    entries: z.array(reportCommentEntrySchema),
});

export type ProcessReportCommentsValues = z.infer<
    typeof processReportCommentsSchema
>;
export type ReportCommentEntryValues = z.infer<typeof reportCommentEntrySchema>;
