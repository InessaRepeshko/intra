import { IdentityRole } from "../../enums/identity-role.enum";
import { IdentityStatus } from "../../enums/identity-status.enum";
import { UserSortField } from "../../enums/user-sort-field.enum";
import { SortDirection } from "../../../common/enums/sort-direction.enum";

export type UserSearchQuery = {
    search?: string;
    firstName?: string;
    secondName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    status?: IdentityStatus;
    teamId?: number;
    positionId?: number;
    managerId?: number;
    roles?: IdentityRole[];
    sortBy?: UserSortField;
    sortDirection?: SortDirection;
};
