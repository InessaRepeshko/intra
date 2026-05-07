import { POSITION_CONSTRAINTS } from '@intra/shared-kernel';
import { z } from 'zod';

export const positionFormSchema = z.object({
    title: z
        .string()
        .min(POSITION_CONSTRAINTS.TITLE.LENGTH.MIN, 'Title is required')
        .max(
            POSITION_CONSTRAINTS.TITLE.LENGTH.MAX,
            `Title must be at most ${POSITION_CONSTRAINTS.TITLE.LENGTH.MAX} characters`,
        ),
    description: z
        .string()
        .max(
            POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
            `Description must be at most ${POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MAX} characters`,
        )
        .optional()
        .or(z.literal('')),
    competenceIds: z.array(z.coerce.number().int().min(1)).default([]),
});

export type PositionFormValues = z.infer<typeof positionFormSchema>;
