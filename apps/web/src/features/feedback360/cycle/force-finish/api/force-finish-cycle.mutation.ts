import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { forceFinishCycle } from '@entities/feedback360/cycle/api/cycle.api';
import { cycleKeys } from '@entities/feedback360/cycle/api/cycle.queries';

export function useForceFinishCycleMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => forceFinishCycle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cycleKeys.lists() });
            toast.success('Cycle force-finished successfully');
        },
        onError: () => {
            toast.error('Failed to force-finish cycle');
        },
    });
}
