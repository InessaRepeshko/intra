import {
    createReview,
    updateReview,
} from '@entities/feedback360/review/api/review.api';
import { reviewKeys } from '@entities/feedback360/review/api/review.queries';
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

export function useCreateReviewFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            values,
            rateeUser,
            currentUser,
        }: {
            values: ReviewFormValues;
            rateeUser: User;
            currentUser: AuthUser;
        }) =>
            createReview({
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
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
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
