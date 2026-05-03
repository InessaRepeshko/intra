import { createReportComment } from '@entities/reporting/individual-report-comment/api/individual-report-comment.api';
import { commentKeys } from '@entities/reporting/individual-report-comment/api/individual-report-comment.queries';
import type { CreateReportCommentPayload } from '@entities/reporting/individual-report-comment/model/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ProcessReportCommentsValues } from '../model/process-comments-schema';

interface ProcessReportCommentsVariables {
    reportId: number;
    values: ProcessReportCommentsValues;
}

function buildReportCommentPayloads(
    reportId: number,
    values: ProcessReportCommentsValues,
): CreateReportCommentPayload[] {
    return values.entries.map((entry) => ({
        reportId,
        questionId: entry.questionId,
        questionTitle: entry.questionTitle,
        comment: entry.comment.trim(),
        respondentCategories: [entry.respondentCategory],
        commentSentiment: entry.commentSentiment,
        numberOfMentions: 1,
    }));
}

export function useProcessReportCommentsMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            reportId,
            values,
        }: ProcessReportCommentsVariables) => {
            const payloads = buildReportCommentPayloads(reportId, values);

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
