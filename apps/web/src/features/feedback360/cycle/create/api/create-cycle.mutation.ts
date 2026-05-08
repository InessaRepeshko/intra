import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createCycle } from '@entities/feedback360/cycle/api/cycle.api';
import { cycleKeys } from '@entities/feedback360/cycle/api/cycle.queries';
import type { CreateCycleFormValues } from '../model/create-cycle.schema';

export function useCreateCycleMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: CreateCycleFormValues) =>
            createCycle({
                ...values,
                description: values.description || undefined,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                reviewDeadline: values.reviewDeadline?.toISOString(),
                approvalDeadline: values.approvalDeadline?.toISOString(),
                responseDeadline: values.responseDeadline?.toISOString(),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cycleKeys.lists() });
            toast.success('Cycle created successfully');
        },
        onError: () => {
            toast.error('Failed to create cycle');
        },
    });
}
