import { ANSWER_CONSTRAINTS, AnswerType } from '@intra/shared-kernel';
import { z } from 'zod';

const numericalAnswerSchema = z.object({
    questionId: z.coerce.number().int().positive(),
    answerType: z.literal(AnswerType.NUMERICAL_SCALE),
    numericalValue: z.coerce
        .number({ message: 'Please select a value' })
        .int()
        .min(ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MIN)
        .max(ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MAX),
    textValue: z.string().optional(),
});

const textAnswerSchema = z.object({
    questionId: z.coerce.number().int().positive(),
    answerType: z.literal(AnswerType.TEXT_FIELD),
    numericalValue: z.number().optional(),
    textValue: z
        .string()
        .trim()
        .min(
            ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MIN,
            'Please provide a response',
        )
        .max(
            ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MAX,
            `Response must be at most ${ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MAX} characters`,
        ),
});

export const submitSurveyAnswerSchema = z.discriminatedUnion('answerType', [
    numericalAnswerSchema,
    textAnswerSchema,
]);

export const submitSurveySchema = z.object({
    answers: z.array(submitSurveyAnswerSchema),
});

export type SubmitSurveyAnswerValues = z.infer<typeof submitSurveyAnswerSchema>;
export type SubmitSurveyFormValues = z.infer<typeof submitSurveySchema>;
