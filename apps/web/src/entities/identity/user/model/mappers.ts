import type {
    UserDto,
    UserResponseDto,
} from '@entities/identity/user/model/types';

/**
 * Frontend User model with Date objects instead of ISO strings.
 */
export interface User extends Omit<
    UserResponseDto,
    'fullName' | 'createdAt' | 'updatedAt'
> {
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
    positionTitle?: string | null;
    teamTitle?: string | null;
    managerName?: string | null;
}

/**
 * Maps a backend UserResponseDto (dates as ISO strings) to
 * the frontend User model (dates as Date objects).
 */
export function mapUserResponseDtoToModel(dto: UserResponseDto): User {
    return {
        ...dto,
        fullName: dto.fullName ?? '',
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };
}

export function mapUserDtoToModel(dto: UserDto): User {
    return {
        ...dto,
        fullName: dto.fullName ?? '',
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };
}
