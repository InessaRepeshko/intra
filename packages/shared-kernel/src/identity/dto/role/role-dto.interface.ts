import { IdentityRole } from '../../enums/identity-role.enum';

export interface RoleDto {
    id: number;
    code: IdentityRole;
    title: string;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
