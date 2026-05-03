import {
    CommentSentiment,
    REPORT_COMMENT_CONSTRAINTS,
} from '@intra/shared-kernel';
import { z } from 'zod';

const reportCommentEntrySchema = z.object({
    questionId: z.coerce.number().int().positive(),
    questionTitle: z.string().min(1),
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
    numberOfMentions: z.coerce
        .number({ message: 'Please enter a number' })
        .int('Mentions must be an integer')
        .min(1, 'Mentions must be at least 1'),
});

export const processReportCommentsSchema = z.object({
    entries: z.array(reportCommentEntrySchema).min(1, 'Add at least one comment'),
});

export type ProcessReportCommentsValues = z.infer<
    typeof processReportCommentsSchema
>;
export type ReportCommentEntryValues = z.infer<typeof reportCommentEntrySchema>;
