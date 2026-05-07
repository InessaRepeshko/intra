import { TEAM_CONSTRAINTS } from '@intra/shared-kernel';
import { z } from 'zod';

export const teamFormSchema = z.object({
    title: z
        .string()
        .min(TEAM_CONSTRAINTS.TITLE.LENGTH.MIN, 'Title is required')
        .max(
            TEAM_CONSTRAINTS.TITLE.LENGTH.MAX,
            `Title must be at most ${TEAM_CONSTRAINTS.TITLE.LENGTH.MAX} characters`,
        ),
    description: z
        .string()
        .max(
            TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
            `Description must be at most ${TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MAX} characters`,
        )
        .optional()
        .or(z.literal('')),
    headId: z.coerce.number().int().min(0).optional(),
    memberIds: z.array(z.coerce.number().int().min(1)).default([]),
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;
