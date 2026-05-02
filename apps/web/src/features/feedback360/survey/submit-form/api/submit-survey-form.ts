import { createAnswerToReview } from '@entities/feedback360/answer/api/answer.api';
import {
    AnswerType,
    type CreateAnswerToReviewPayload,
    type RespondentCategory,
} from '@entities/feedback360/answer/model/types';
import { commentKeys } from '@entities/reporting/individual-report-comment/api/individual-report-comment.queries';
import { reviewKeys } from '@entities/feedback360/review/api/review.queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { SubmitSurveyFormValues } from '../model/submit-survey-schema';

interface SubmitSurveyVariables {
    reviewId: number;
    respondentCategory: RespondentCategory;
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
            values,
        }: SubmitSurveyVariables) => {
            const payloads = buildAnswerPayloads(values, respondentCategory);

            await Promise.all(
                payloads.map((payload) =>
                    createAnswerToReview(reviewId, payload),
                ),
            );

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
            toast.success(
                `Survey submitted successfully (${count} ${count === 1 ? 'answer' : 'answers'})`,
            );
        },
        onError: () => {
            toast.error('Failed to submit survey. Please try again.');
        },
    });
}
