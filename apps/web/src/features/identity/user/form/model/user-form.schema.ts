import {
    IDENTITY_ROLES,
    IDENTITY_STATUSES,
    USER_CONSTRAINTS,
} from '@intra/shared-kernel';
import { z } from 'zod';

export const userFormSchema = z.object({
    firstName: z
        .string()
        .min(USER_CONSTRAINTS.NAME.LENGTH.MIN, 'First name is required')
        .max(
            USER_CONSTRAINTS.NAME.LENGTH.MAX,
            `First name must be at most ${USER_CONSTRAINTS.NAME.LENGTH.MAX} characters`,
        ),
    secondName: z
        .string()
        .max(
            USER_CONSTRAINTS.NAME.LENGTH.MAX,
            `Second name must be at most ${USER_CONSTRAINTS.NAME.LENGTH.MAX} characters`,
        )
        .optional()
        .or(z.literal('')),
    lastName: z
        .string()
        .min(USER_CONSTRAINTS.NAME.LENGTH.MIN, 'Last name is required')
        .max(
            USER_CONSTRAINTS.NAME.LENGTH.MAX,
            `Last name must be at most ${USER_CONSTRAINTS.NAME.LENGTH.MAX} characters`,
        ),
    email: z
        .string()
        .min(USER_CONSTRAINTS.EMAIL.LENGTH.MIN, 'Email is required')
        .max(
            USER_CONSTRAINTS.EMAIL.LENGTH.MAX,
            `Email must be at most ${USER_CONSTRAINTS.EMAIL.LENGTH.MAX} characters`,
        )
        .email('Must be a valid email address'),
    status: z.enum(IDENTITY_STATUSES, { message: 'Status is required' }),
    roles: z
        .array(z.enum(IDENTITY_ROLES))
        .min(1, 'At least one role is required'),
    positionId: z.coerce.number().int().min(0).optional(),
    teamId: z.coerce.number().int().min(0).optional(),
    managerId: z.coerce.number().int().min(0).optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
