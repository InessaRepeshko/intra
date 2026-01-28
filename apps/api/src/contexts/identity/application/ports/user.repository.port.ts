import {
    IdentityRole,
    UpdateUserPayload,
    UserSearchQuery,
} from '@intra/shared-kernel';
import { UserDomain } from '../../domain/user.domain';

export const IDENTITY_USER_REPOSITORY = Symbol('IDENTITY.USER_REPOSITORY');

export interface UserRepositoryPort {
    create(user: UserDomain): Promise<UserDomain>;
    findById(
        id: number,
        opts?: { withRoles?: boolean },
    ): Promise<UserDomain | null>;
    search(query: UserSearchQuery): Promise<UserDomain[]>;
    updateById(id: number, patch: UpdateUserPayload): Promise<UserDomain>;
    deleteById(id: number): Promise<void>;
    replaceRoles(userId: number, roles: IdentityRole[]): Promise<UserDomain>;
}
