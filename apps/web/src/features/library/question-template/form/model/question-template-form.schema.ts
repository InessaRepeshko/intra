import {
    ANSWER_TYPES,
    QUESTION_TEMPLATE_CONSTRAINTS,
    QUESTION_TEMPLATE_STATUSES,
} from '@intra/shared-kernel';
import { z } from 'zod';

export const questionTemplateFormSchema = z.object({
    title: z
        .string()
        .min(
            QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MIN,
            'Title is required',
        )
        .max(
            QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MAX,
            `Title must be at most ${QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MAX} characters`,
        ),
    answerType: z.enum(ANSWER_TYPES, { message: 'Answer type is required' }),
    isForSelfassessment: z.boolean(),
    status: z.enum(QUESTION_TEMPLATE_STATUSES, {
        message: 'Status is required',
    }),
    competenceId: z.coerce.number().int().min(1, 'Competence is required'),
    positionIds: z
        .array(z.coerce.number().int().min(1))
        .min(1, 'At least one position is required'),
});

export type QuestionTemplateFormValues = z.infer<
    typeof questionTemplateFormSchema
>;
