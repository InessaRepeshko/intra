import { REVIEW_STAGES } from '@intra/shared-kernel';
import { z } from 'zod';

export const reviewFormSchema = z.object({
    rateeId: z.coerce.number().int().min(1, 'Ratee is required'),
    hrId: z.coerce.number().int().min(1),
    hrNote: z.string().max(2000).optional().or(z.literal('')),
    cycleId: z.preprocess(
        (val) =>
            val === '' || val === null || val === undefined
                ? undefined
                : Number(val),
        z.number().int().optional(),
    ),
    stage: z.enum(REVIEW_STAGES, { message: 'Stage is required' }),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
