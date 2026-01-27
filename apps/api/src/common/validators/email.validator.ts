import { USER_CONSTRAINTS } from '@intra/shared-kernel';
import { applyDecorators } from '@nestjs/common';
import {
    IsEmail as ClassValidatorIsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    ValidateIf,
} from 'class-validator';

export function IsEmail(isOptional: boolean, allowNull: boolean = false) {
    const baseDecorators = [
        IsString(),
        allowNull ? IsOptional() : IsNotEmpty(),
        Length(
            USER_CONSTRAINTS.EMAIL.LENGTH.MIN,
            USER_CONSTRAINTS.EMAIL.LENGTH.MAX,
        ),
        ClassValidatorIsEmail(),
    ];

    if (allowNull) {
        return applyDecorators(
            ValidateIf((value) => value !== null),
            ...baseDecorators,
            IsOptional(),
        );
    } else if (isOptional) {
        return applyDecorators(IsOptional(), ...baseDecorators);
    } else {
        return applyDecorators(...baseDecorators);
    }
}
