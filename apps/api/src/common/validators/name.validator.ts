<<<<<<< HEAD
import { USER_CONSTRAINTS } from '@intra/shared-kernel';
import { applyDecorators } from '@nestjs/common';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    Matches,
    ValidateIf,
} from 'class-validator';

export function IsName(
    isOptional: boolean,
    allowNull: boolean = false,
    minLength: number = USER_CONSTRAINTS.NAME.LENGTH.MIN,
    maxLength: number = USER_CONSTRAINTS.NAME.LENGTH.MAX,
) {
    const baseDecorators = [IsString(), Length(minLength, maxLength)];

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
    const baseDecorators = [
        IsString(),
        allowNull ? IsOptional() : IsNotEmpty(),
        Length(
            USER_CONSTRAINTS.NAME.LENGTH.MIN,
            USER_CONSTRAINTS.NAME.LENGTH.MAX,
        ),
        Matches(USER_CONSTRAINTS.NAME.PATTERN),
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

export function IsEnglishNameWithNumbers(
    isOptional: boolean,
    allowNull: boolean = false,
    minLength: number = USER_CONSTRAINTS.EMAIL.LENGTH.MIN,
    maxLength: number = USER_CONSTRAINTS.EMAIL.LENGTH.MAX,
) {
    const baseDecorators = [
        Matches(USER_CONSTRAINTS.EMAIL.PATTERN, {
            message:
                'Value can only contain English letters, numbers, and hyphens',
        }),
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
=======
import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString, Length, Matches, ValidateIf } from 'class-validator';
import { UserConstants } from './constants';

export function IsName(
    isOptional: boolean,
    allowNull: boolean = false,
    minLength: number = UserConstants.NAME_MIN_LENGTH,
    maxLength: number = UserConstants.NAME_MAX_LENGTH,
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
    const baseDecorators = [
        IsString(),
        allowNull ? IsOptional() : IsNotEmpty(), 
        Length(UserConstants.NAME_MIN_LENGTH, UserConstants.NAME_MAX_LENGTH), 
        Matches(UserConstants.PATTERN),
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

export function IsEnglishNameWithNumbers(
    isOptional: boolean,
    allowNull: boolean = false,
    minLength: number = UserConstants.NAME_MIN_LENGTH,
    maxLength: number = UserConstants.NAME_MAX_LENGTH,
) {
    const baseDecorators = [
        Matches(UserConstants.PATTERN_WITH_NUMBERS, {
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
>>>>>>> origin/main
