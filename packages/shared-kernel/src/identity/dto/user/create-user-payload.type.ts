import { IdentityRole } from '../../enums/identity-role.enum';
import { IdentityStatus } from '../../enums/identity-status.enum';

export type CreateUserPayload = {
    firstName: string;
    secondName?: string;
    lastName: string;
    fullName?: string;
    email: string;
    avatarUrl?: string | null;
    status?: IdentityStatus;
    positionId?: number | null;
    teamId?: number | null;
    managerId?: number | null;
    roles?: IdentityRole[];
};
