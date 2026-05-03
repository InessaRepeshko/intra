import {
    CreateUserPayload,
    IDENTITY_ROLES,
    IDENTITY_STATUSES,
    IdentityRole,
    IdentityStatus,
    SortDirection,
    UpdateUserPayload,
    UserDto,
    UserResponseDto,
    UserSearchQuery,
} from '@intra/shared-kernel';

export {
    IDENTITY_ROLES as IDENTITY_ROLES_ENUM_VALUES,
    IDENTITY_STATUSES as IDENTITY_STATUSES_ENUM_VALUES,
    IdentityRole,
    IdentityStatus,
    SortDirection,
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

export interface AuthContextType {
    user: AuthUser;
    hasRole: (...roles: IdentityRole[]) => boolean;
    isAdmin: boolean;
    isHR: boolean;
    isManager: boolean;
    isEmployee: boolean;
}
