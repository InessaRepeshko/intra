import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateCycle } from '@entities/feedback360/cycle/api/cycle.api';
import { cycleKeys } from '@entities/feedback360/cycle/api/cycle.queries';
import { CycleStage } from '@intra/shared-kernel';

export function useArchiveCycleMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            updateCycle(id, { stage: CycleStage.ARCHIVED }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cycleKeys.lists() });
            toast.success('Cycle archived successfully');
        },
        onError: () => {
            toast.error('Failed to archive cycle');
        },
    });
}
