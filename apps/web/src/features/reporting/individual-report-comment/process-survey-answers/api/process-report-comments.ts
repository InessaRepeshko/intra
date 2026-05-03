import type { RespondentCategory } from '@entities/feedback360/answer/model/types';
import { createReportComment } from '@entities/reporting/individual-report-comment/api/individual-report-comment.api';
import { commentKeys } from '@entities/reporting/individual-report-comment/api/individual-report-comment.queries';
import type { CreateReportCommentPayload } from '@entities/reporting/individual-report-comment/model/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ProcessReportCommentsValues } from '../model/process-comments-schema';

interface ProcessReportCommentsVariables {
    reportId: number;
    values: ProcessReportCommentsValues;
    respondentCategoriesByQuestion: Map<number, RespondentCategory[]>;
}

function buildReportCommentPayloads(
    reportId: number,
    values: ProcessReportCommentsValues,
    respondentCategoriesByQuestion: Map<number, RespondentCategory[]>,
): CreateReportCommentPayload[] {
    return values.entries.map((entry) => ({
        reportId,
        questionId: entry.questionId,
        questionTitle: entry.questionTitle,
        comment: entry.comment.trim(),
        respondentCategories:
            respondentCategoriesByQuestion.get(entry.questionId) ?? [],
        commentSentiment: entry.commentSentiment,
        numberOfMentions: entry.numberOfMentions,
    }));
}

export function useProcessReportCommentsMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            reportId,
            values,
            respondentCategoriesByQuestion,
        }: ProcessReportCommentsVariables) => {
            const payloads = buildReportCommentPayloads(
                reportId,
                values,
                respondentCategoriesByQuestion,
            );

            await Promise.all(
                payloads.map((payload) =>
                    createReportComment(reportId, payload),
                ),
            );

            return payloads.length;
        },
        onSuccess: (count, variables) => {
            queryClient.invalidateQueries({
                queryKey: commentKeys.list(variables.reportId),
            });
            toast.success(
                `Saved ${count} ${count === 1 ? 'comment' : 'comments'}`,
            );
        },
        onError: () => {
            toast.error('Failed to save report comments. Please try again.');
        },
    });
}
