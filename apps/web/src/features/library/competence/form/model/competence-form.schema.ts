import { COMPETENCE_CONSTRAINTS } from '@intra/shared-kernel';
import { z } from 'zod';

export const competenceFormSchema = z.object({
    title: z
        .string()
        .min(COMPETENCE_CONSTRAINTS.TITLE.LENGTH.MIN, 'Title is required')
        .max(
            COMPETENCE_CONSTRAINTS.TITLE.LENGTH.MAX,
            `Title must be at most ${COMPETENCE_CONSTRAINTS.TITLE.LENGTH.MAX} characters`,
        ),
    code: z
        .string()
        .max(
            COMPETENCE_CONSTRAINTS.CODE.LENGTH.MAX,
            `Code must be at most ${COMPETENCE_CONSTRAINTS.CODE.LENGTH.MAX} characters`,
        )
        .optional()
        .or(z.literal('')),
    description: z
        .string()
        .max(
            COMPETENCE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
            `Description must be at most ${COMPETENCE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX} characters`,
        )
        .optional()
        .or(z.literal('')),
    positionIds: z.array(z.coerce.number().int().min(1)).default([]),
});

export type CompetenceFormValues = z.infer<typeof competenceFormSchema>;
