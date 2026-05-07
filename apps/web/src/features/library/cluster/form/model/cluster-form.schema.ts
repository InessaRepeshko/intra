import { CLUSTER_CONSTRAINTS } from '@intra/shared-kernel';
import { z } from 'zod';

export const clusterFormSchema = z
    .object({
        title: z
            .string()
            .min(CLUSTER_CONSTRAINTS.TITLE.LENGTH.MIN, 'Title is required')
            .max(
                CLUSTER_CONSTRAINTS.TITLE.LENGTH.MAX,
                `Title must be at most ${CLUSTER_CONSTRAINTS.TITLE.LENGTH.MAX} characters`,
            ),
        description: z
            .string()
            .min(
                CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
                'Description is required',
            )
            .max(
                CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
                `Description must be at most ${CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MAX} characters`,
            ),
        competenceId: z.coerce
            .number()
            .int()
            .min(1, 'Competence is required'),
        lowerBound: z.coerce
            .number()
            .min(
                CLUSTER_CONSTRAINTS.SCORE.MIN,
                `Lower bound must be at least ${CLUSTER_CONSTRAINTS.SCORE.MIN}`,
            )
            .max(
                CLUSTER_CONSTRAINTS.SCORE.MAX,
                `Lower bound must be at most ${CLUSTER_CONSTRAINTS.SCORE.MAX}`,
            ),
        upperBound: z.coerce
            .number()
            .min(
                CLUSTER_CONSTRAINTS.SCORE.MIN,
                `Upper bound must be at least ${CLUSTER_CONSTRAINTS.SCORE.MIN}`,
            )
            .max(
                CLUSTER_CONSTRAINTS.SCORE.MAX,
                `Upper bound must be at most ${CLUSTER_CONSTRAINTS.SCORE.MAX}`,
            ),
    })
    .refine((data) => data.upperBound > data.lowerBound, {
        message: 'Upper bound must be greater than lower bound',
        path: ['upperBound'],
    });

export type ClusterFormValues = z.infer<typeof clusterFormSchema>;
