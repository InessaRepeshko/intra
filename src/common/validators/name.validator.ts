import { applyDecorators } from '@nestjs/common';
import { IsOptional, IsString, Length, Matches, ValidateIf } from 'class-validator';
import { UserNameConstants } from './constants';

export function IsName(
    isOptional: boolean,
    allowNull: boolean = false,
    minLength: number = UserNameConstants.MIN_LENGTH,
    maxLength: number = UserNameConstants.MAX_LENGTH,
) {
    const baseDecorators = [
        IsString(),
        Length(minLength, maxLength),
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

export function IsEnglishName(isOptional: boolean, allowNull: boolean = false) {
    const baseDecorators = [Matches(UserNameConstants.PATTERN), Length(UserNameConstants.MIDDLE_LENGTH, UserNameConstants.MAX_LENGTH)];

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

export function IsEnglishNameWithNumbers(
    isOptional: boolean,
    allowNull: boolean = false,
    minLength: number = UserNameConstants.MIDDLE_LENGTH,
    maxLength: number = UserNameConstants.MAX_LENGTH
) {
    const baseDecorators = [
        Matches(UserNameConstants.PATTERN_WITH_NUMBERS, {
            message: 'Value can only contain English letters, numbers, and hyphens',
        }),
        Length(minLength, maxLength)
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
