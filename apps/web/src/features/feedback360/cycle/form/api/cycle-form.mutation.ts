import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import {
    createCycle,
    updateCycle,
} from '@entities/feedback360/cycle/api/cycle.api';
import { cycleKeys } from '@entities/feedback360/cycle/api/cycle.queries';
import type { CycleFormValues } from '../model/cycle-form.schema';

function toIsoOrUndefined(date?: Date): string | undefined {
    return date ? date.toISOString() : undefined;
}

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

export function useCreateCycleFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: CycleFormValues) =>
            createCycle({
                ...values,
                description: values.description || undefined,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                reviewDeadline: toIsoOrUndefined(values.reviewDeadline),
                approvalDeadline: toIsoOrUndefined(values.approvalDeadline),
                responseDeadline: toIsoOrUndefined(values.responseDeadline),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cycleKeys.lists() });
            toast.success('Cycle created successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to create cycle'),
            );
        },
    });
}

export function useUpdateCycleFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, values }: { id: number; values: CycleFormValues }) =>
            updateCycle(id, {
                ...values,
                description: values.description || undefined,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                reviewDeadline: toIsoOrUndefined(values.reviewDeadline) ?? null,
                approvalDeadline:
                    toIsoOrUndefined(values.approvalDeadline) ?? null,
                responseDeadline:
                    toIsoOrUndefined(values.responseDeadline) ?? null,
            }),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: cycleKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: cycleKeys.detail(variables.id),
            });
            toast.success('Cycle updated successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to update cycle'),
            );
        },
    });
}
