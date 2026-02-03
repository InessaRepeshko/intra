import { IdentityRole } from '../../enums/identity-role.enum';
import { IdentityStatus } from '../../enums/identity-status.enum';

export interface UserDto {
    id: number;
    firstName: string;
    secondName: string | null;
    lastName: string;
    fullName: string | null;
    email: string;
    avatarUrl: string | null;
    status: IdentityStatus;
    positionId: number | null;
    teamId: number | null;
    managerId: number | null;
    roles: IdentityRole[];
    createdAt: Date;
    updatedAt: Date;
}
