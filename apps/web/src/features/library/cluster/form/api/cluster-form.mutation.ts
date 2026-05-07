import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import {
    createCluster,
    updateCluster,
} from '@entities/library/cluster/api/cluster.api';
import { clusterKeys } from '@entities/library/cluster/api/cluster.queries';
import type {
    CreateClusterPayload,
    UpdateClusterPayload,
} from '@entities/library/cluster/model/types';

import type { ClusterFormValues } from '../model/cluster-form.schema';

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

export function useCreateClusterFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: ClusterFormValues) => {
            const payload: CreateClusterPayload = {
                title: values.title,
                description: values.description,
                competenceId: values.competenceId,
                lowerBound: values.lowerBound,
                upperBound: values.upperBound,
            };
            return createCluster(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: clusterKeys.lists(),
            });
            toast.success('Cluster created successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to create cluster'),
            );
        },
    });
}

export function useUpdateClusterFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            values,
        }: {
            id: number;
            values: ClusterFormValues;
        }) => {
            const payload: UpdateClusterPayload = {
                title: values.title,
                description: values.description,
                competenceId: values.competenceId,
                lowerBound: values.lowerBound,
                upperBound: values.upperBound,
            };
            return updateCluster(id, payload);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: clusterKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: clusterKeys.detail(variables.id),
            });
            toast.success('Cluster updated successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to update cluster'),
            );
        },
    });
}
