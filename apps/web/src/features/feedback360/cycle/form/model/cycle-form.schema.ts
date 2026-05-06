import { CYCLE_CONSTRAINTS, CYCLE_STAGES } from '@intra/shared-kernel';
import { z } from 'zod';

export const cycleFormSchema = z
    .object({
        title: z
            .string()
            .min(CYCLE_CONSTRAINTS.TITLE.LENGTH.MIN, 'Title is required')
            .max(
                CYCLE_CONSTRAINTS.TITLE.LENGTH.MAX,
                `Title must be at most ${CYCLE_CONSTRAINTS.TITLE.LENGTH.MAX} characters`,
            ),
        description: z
            .string()
            .max(
                CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
                `Description must be at most ${CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX} characters`,
            )
            .optional()
            .or(z.literal('')),
        hrId: z.coerce.number().int().min(1, 'HR ID must be a positive number'),
        minRespondentsThreshold: z.coerce
            .number()
            .int()
            .min(
                CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN,
                `Minimum ${CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN} respondents`,
            )
            .optional(),
        stage: z.enum(CYCLE_STAGES, { message: 'Stage is required' }),
        startDate: z.coerce.date({ message: 'Start date is required' }),
        endDate: z.coerce.date({ message: 'End date is required' }),
        reviewDeadline: z.coerce.date().optional(),
        approvalDeadline: z.coerce.date().optional(),
        responseDeadline: z.coerce.date().optional(),
    })
    .refine((data) => data.endDate > data.startDate, {
        message: 'End date must be after start date',
        path: ['endDate'],
    });

export type CycleFormValues = z.infer<typeof cycleFormSchema>;
