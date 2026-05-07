import { createAnswerToReview } from '@entities/feedback360/answer/api/answer.api';
import {
    AnswerType,
    type CreateAnswerToReviewPayload,
    type RespondentCategory,
} from '@entities/feedback360/answer/model/types';
import { updateReviewResponseStatus } from '@entities/feedback360/respondent/api/respondent.api';
import { respondentKeys } from '@entities/feedback360/respondent/api/respondent.queries';
import { ResponseStatus } from '@entities/feedback360/respondent/model/types';
import { reviewKeys } from '@entities/feedback360/review/api/review.queries';
import { commentKeys } from '@entities/reporting/individual-report-comment/api/individual-report-comment.queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { SubmitSurveyFormValues } from '../model/submit-survey-schema';

interface SubmitSurveyVariables {
    reviewId: number;
    respondentCategory: RespondentCategory;
    respondentRelationId?: number | null;
    /** Current respondent status — used to skip status update if already COMPLETED. */
    currentResponseStatus?: ResponseStatus | null;
    values: SubmitSurveyFormValues;
}

function buildAnswerPayloads(
    values: SubmitSurveyFormValues,
    respondentCategory: RespondentCategory,
): CreateAnswerToReviewPayload[] {
    return values.answers.map((answer) => {
        if (answer.answerType === AnswerType.NUMERICAL_SCALE) {
            return {
                questionId: answer.questionId,
                respondentCategory,
                answerType: answer.answerType,
                numericalValue: answer.numericalValue,
            };
        }

        return {
            questionId: answer.questionId,
            respondentCategory,
            answerType: answer.answerType,
            textValue: answer.textValue,
        };
    });
}

export function useSubmitSurveyMutation() {
    const queryClient = useQueryClient();

    /**
     * POST /feedback360/reviews/:reviewId/answers for each question (createAnswerToReview).
     * Form data → buildAnswerPayloads → CreateAnswerToReviewPayload.
     */
    return useMutation({
        mutationFn: async ({
            reviewId,
            respondentCategory,
            respondentRelationId,
            currentResponseStatus,
            values,
        }: SubmitSurveyVariables) => {
            const payloads = buildAnswerPayloads(values, respondentCategory);

            await Promise.all(
                payloads.map((payload) =>
                    createAnswerToReview(reviewId, payload),
                ),
            );

            if (respondentRelationId) {
                // Backend state machine: PENDING → IN_PROGRESS → COMPLETED.
                // Always step through IN_PROGRESS (no-op / 400 if already past — ignored).
                if (currentResponseStatus !== ResponseStatus.COMPLETED) {
                    try {
                        await updateReviewResponseStatus(
                            respondentRelationId,
                            ResponseStatus.IN_PROGRESS,
                        );
                    } catch {
                        // Likely already past PENDING — safe to continue.
                    }
                    await updateReviewResponseStatus(
                        respondentRelationId,
                        ResponseStatus.COMPLETED,
                    );
                }
            }

            return payloads.length;
        },
        onSuccess: (count, variables) => {
            queryClient.invalidateQueries({
                queryKey: reviewKeys.answersCount(variables.reviewId),
            });
            queryClient.invalidateQueries({
                queryKey: reviewKeys.detail(variables.reviewId),
            });
            queryClient.invalidateQueries({
                queryKey: commentKeys.answer(variables.reviewId),
            });
            queryClient.invalidateQueries({
                queryKey: respondentKeys.lists(),
            });
            toast.success(
                `Survey submitted successfully (${count} ${count === 1 ? 'answer' : 'answers'})`,
            );
        },
        onError: () => {
            toast.error('Failed to submit survey. Please try again.');
        },
    });
}
