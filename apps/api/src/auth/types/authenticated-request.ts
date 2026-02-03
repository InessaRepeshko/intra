import { IdentityRole } from '@intra/shared-kernel';
import { Request } from 'express';
import { UserDomain } from '../../contexts/identity/domain/user.domain';

export interface AuthenticatedRequest extends Request {
    authUser?: UserDomain;
    authSession?: unknown;
    roles?: IdentityRole[];
}
