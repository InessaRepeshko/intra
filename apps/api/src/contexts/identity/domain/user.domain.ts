import { IdentityRole, IdentityStatus } from '@intra/shared-kernel';

export type UserProps = {
    id?: number;
    firstName: string;
    secondName?: string;
    lastName: string;
    fullName?: string;
    email: string;
    passwordHash: string;
    status?: IdentityStatus;
    positionId?: number | null;
    teamId?: number | null;
    managerId?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
    roles?: IdentityRole[];
};

export interface UserInterface {
    readonly id?: number;
    readonly firstName: string;
    readonly secondName?: string;
    readonly lastName: string;
    readonly fullName: string;
    readonly email: string;
    readonly passwordHash: string;
    readonly status: IdentityStatus;
    readonly positionId?: number | null;
    readonly teamId?: number | null;
    readonly managerId?: number | null;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    readonly roles: IdentityRole[];
}

export class UserDomain implements UserInterface {
    readonly id?: number;
    readonly firstName: string;
    readonly secondName?: string;
    readonly lastName: string;
    readonly fullName: string;
    readonly email: string;
    readonly passwordHash: string;
    readonly status: IdentityStatus;
    readonly positionId?: number | null;
    readonly teamId?: number | null;
    readonly managerId?: number | null;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    readonly roles: IdentityRole[];

    private constructor(props: UserProps) {
        this.id = props.id;
        this.firstName = props.firstName;
        this.secondName = props.secondName;
        this.lastName = props.lastName;
        this.fullName =
            props.fullName ??
            UserDomain.buildFullName(
                props.firstName,
                props.secondName,
                props.lastName,
            );
        this.email = props.email;
        this.passwordHash = props.passwordHash;
        this.status = props.status ?? IdentityStatus.ACTIVE;
        this.positionId = props.positionId ?? null;
        this.teamId = props.teamId ?? null;
        this.managerId = props.managerId ?? null;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.roles = props.roles ?? [];
    }

    static create(props: UserProps): UserDomain {
        return new UserDomain(props);
    }

    withRoles(roles: IdentityRole[]): UserDomain {
        return new UserDomain({ ...this, roles });
    }

    withPatch(patch: Partial<UserProps>): UserDomain {
        return new UserDomain({ ...this, ...patch });
    }

    private static buildFullName(
        firstName: string,
        secondName: string | undefined,
        lastName: string,
    ): string {
        const parts = [firstName, secondName ?? undefined, lastName].filter(
            Boolean,
        );
        return parts.join(' ');
    }
}
