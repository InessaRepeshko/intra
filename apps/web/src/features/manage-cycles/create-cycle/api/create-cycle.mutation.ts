import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createCycle } from '@/entities/cycle/api/cycle.api';
import { cycleKeys } from '@/entities/cycle/api/cycle.queries';
import type { CreateCycleFormValues } from '../model/schema';

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
