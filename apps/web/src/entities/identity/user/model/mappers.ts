import type {
    UserDto,
    UserResponseDto,
} from '@entities/identity/user/model/types';

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
