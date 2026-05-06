import { addRespondentToReview } from '@entities/feedback360/respondent/api/respondent.api';
import { respondentKeys } from '@entities/feedback360/respondent/api/respondent.queries';
import { RespondentCategory } from '@entities/feedback360/respondent/model/types';
import {
    createReview,
    updateReview,
} from '@entities/feedback360/review/api/review.api';
import { reviewKeys } from '@entities/feedback360/review/api/review.queries';
import { addReviewerToReview } from '@entities/feedback360/reviewer/api/reviewer.api';
import { reviewerKeys } from '@entities/feedback360/reviewer/api/reviewer.queries';
import { addQuestionToReview } from '@entities/feedback360/survey/api/review-question-relation.api';
import type { User } from '@entities/identity/user/model/mappers';
import type { AuthUser } from '@entities/identity/user/model/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import type { ReviewFormValues } from '../model/review-form.schema';

function extractApiErrorMessage(error: unknown, fallback: string): string {
    if (isAxiosError(error)) {
        const data = error.response?.data as
            | { message?: string | string[] }
            | undefined;
        const message = data?.message;
        if (Array.isArray(message) && message.length > 0) {
            return message.join('; ');
        }
        if (typeof message === 'string' && message.trim().length > 0) {
            return message;
        }
    }
    return fallback;
}

function buildRespondentPayload(
    user: User,
    rateeId: number,
    managerId?: number | null,
) {
    const fullName =
        user.fullName ??
        `${user.lastName ?? ''} ${user.firstName ?? ''}`.trim();
    let category: RespondentCategory;
    if (user.id === rateeId) {
        category = RespondentCategory.SELF_ASSESSMENT;
    } else if (managerId && user.id === managerId) {
        category = RespondentCategory.OTHER;
    } else if (user.teamId && user.teamId === user.teamId) {
        category = RespondentCategory.TEAM;
    } else {
        category = RespondentCategory.OTHER;
    }
    return {
        respondentId: user.id,
        fullName,
        category,
        positionId: user.positionId ?? 0,
        positionTitle: user.positionTitle ?? '',
        teamId: user.teamId ?? null,
        teamTitle: user.teamTitle ?? null,
    };
}

function buildReviewerPayload(user: User) {
    const fullName =
        user.fullName ??
        `${user.lastName ?? ''} ${user.firstName ?? ''}`.trim();
    return {
        reviewerId: user.id,
        fullName,
        positionId: user.positionId ?? 0,
        positionTitle: user.positionTitle ?? '',
        teamId: user.teamId ?? null,
        teamTitle: user.teamTitle ?? null,
    };
}

export function useCreateReviewFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            values,
            rateeUser,
            currentUser,
            respondentUsers,
            reviewerUsers,
            questionTemplateIds,
        }: {
            values: ReviewFormValues;
            rateeUser: User;
            currentUser: AuthUser;
            respondentUsers: User[];
            reviewerUsers: User[];
            questionTemplateIds: number[];
        }) => {
            const review = await createReview({
                rateeId: values.rateeId,
                rateeFullName:
                    rateeUser.fullName ??
                    `${rateeUser.lastName ?? ''} ${rateeUser.firstName ?? ''}`.trim(),
                rateePositionId: rateeUser.positionId ?? 0,
                rateePositionTitle: rateeUser.positionTitle ?? '',
                hrId: values.hrId,
                hrFullName: currentUser.fullName,
                hrNote: values.hrNote || undefined,
                teamId: rateeUser.teamId ?? null,
                teamTitle: rateeUser.teamTitle ?? null,
                managerId: rateeUser.managerId ?? null,
                managerFullName: rateeUser.managerName ?? null,
                cycleId: values.cycleId ?? null,
                stage: values.stage,
            });

            await Promise.all(
                respondentUsers.map((user) =>
                    addRespondentToReview(
                        review.id,
                        buildRespondentPayload(
                            user,
                            values.rateeId,
                            rateeUser.managerId ?? null,
                        ),
                    ),
                ),
            );

            await Promise.all(
                reviewerUsers.map((user) =>
                    addReviewerToReview(review.id, buildReviewerPayload(user)),
                ),
            );

            await Promise.all(
                questionTemplateIds.map((questionTemplateId) =>
                    addQuestionToReview(review.id, questionTemplateId),
                ),
            );

            return review;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
            queryClient.invalidateQueries({ queryKey: respondentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: reviewerKeys.lists() });
            toast.success('Review created successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to create review'),
            );
        },
    });
}

export function useUpdateReviewFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            values,
            rateeUser,
        }: {
            id: number;
            values: ReviewFormValues;
            rateeUser?: User | null;
        }) =>
            updateReview(id, {
                ...(rateeUser
                    ? {
                          rateeId: values.rateeId,
                          rateeFullName:
                              rateeUser.fullName ??
                              `${rateeUser.lastName ?? ''} ${rateeUser.firstName ?? ''}`.trim(),
                          rateePositionId: rateeUser.positionId ?? 0,
                          rateePositionTitle: rateeUser.positionTitle ?? '',
                          teamId: rateeUser.teamId ?? null,
                          teamTitle: rateeUser.teamTitle ?? null,
                          managerId: rateeUser.managerId ?? null,
                          managerFullName: rateeUser.managerName ?? null,
                      }
                    : {}),
                hrNote: values.hrNote || undefined,
                cycleId: values.cycleId ?? null,
                stage: values.stage,
            }),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: reviewKeys.detail(variables.id),
            });
            toast.success('Review updated successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to update review'),
            );
        },
    });
}
