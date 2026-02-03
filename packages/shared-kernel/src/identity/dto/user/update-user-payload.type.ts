import { IdentityStatus } from "../../enums/identity-status.enum";

export type UpdateUserPayload = Partial<{
    firstName: string;
    secondName: string | null;
    lastName: string;
    fullName: string;
    passwordHash: string;
    status: IdentityStatus;
    positionId: number;
    teamId: number | null;
    managerId: number | null;
}>;
