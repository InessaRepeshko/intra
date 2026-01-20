import { applyDecorators } from '@nestjs/common';
import { IsEmail as ClassValidatorIsEmail, IsNotEmpty, Length, IsOptional, IsString, ValidateIf } from 'class-validator';
import { UserConstants } from '../constants/index';

export function IsEmail(isOptional: boolean, allowNull: boolean = false) {
    const baseDecorators = [
        IsString(),
        allowNull ? IsOptional() : IsNotEmpty(),
        Length(UserConstants.EMAIL_MIN_LENGTH, UserConstants.EMAIL_MAX_LENGTH),
        ClassValidatorIsEmail(),
    ];

    if (allowNull) {
        return applyDecorators(
            ValidateIf((value) => value !== null),
            ...baseDecorators,
            IsOptional(),
        );
    } else if (isOptional) {
        return applyDecorators(
            IsOptional(),
            ...baseDecorators,
        );
    } else {
        return applyDecorators(
            ...baseDecorators,
        );
    }
}
