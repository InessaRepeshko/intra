import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteCycle } from '@/entities/cycle/api/cycle.api';
import { cycleKeys } from '@/entities/cycle/api/cycle.queries';

export function useDeleteCycleMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteCycle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cycleKeys.lists() });
            toast.success('Cycle deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete cycle');
        },
    });
}
