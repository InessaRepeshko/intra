import {
    CreateUserPayload,
    IdentityRole,
    IdentityStatus,
    UpdateUserPayload,
    UserDto,
    UserResponseDto,
    UserSearchQuery,
    SortDirection,
    IDENTITY_STATUSES,
    IDENTITY_ROLES,
} from '@intra/shared-kernel';

export {
    IdentityRole,
    IdentityStatus,
    SortDirection,
    IDENTITY_STATUSES as IDENTITY_STATUSES_ENUM_VALUES,
    IDENTITY_ROLES as IDENTITY_ROLES_ENUM_VALUES,
};
export type {
    CreateUserPayload,
    UpdateUserPayload,
    UserDto,
    UserResponseDto,
    UserSearchQuery,
};

export interface AuthUser {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    roles: IdentityRole[];
    positionTitle?: string;
    teamTitle?: string;
}
