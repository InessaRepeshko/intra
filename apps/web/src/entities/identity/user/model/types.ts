import {
    CreateUserPayload,
    IdentityRole,
    IdentityStatus,
    UpdateUserPayload,
    UserDto,
    UserSearchQuery,
} from '@intra/shared-kernel';

export { IdentityRole, IdentityStatus };
export type { CreateUserPayload, UpdateUserPayload, UserDto, UserSearchQuery };

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
