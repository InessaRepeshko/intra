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

const getFullAvatarUrl = (avatarUrl?: string | null): string | null => {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith('http') || avatarUrl.startsWith('/')) return avatarUrl;
    // В Next.js файли з папки public доступні від кореня (/)
    return `/user-avatars/${avatarUrl}`;
};

export function mapUserResponseDtoToModel(dto: UserResponseDto): User {
    return {
        ...dto,
        avatarUrl: getFullAvatarUrl(dto.avatarUrl),
        fullName: dto.fullName ?? '',
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };
}

export function mapUserDtoToModel(dto: UserDto): User {
    return {
        ...dto,
        avatarUrl: getFullAvatarUrl(dto.avatarUrl),
        fullName: dto.fullName ?? '',
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };
}
