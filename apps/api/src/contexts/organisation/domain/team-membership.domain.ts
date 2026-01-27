import { UserDomain } from '../../identity/domain/user.domain';

export type TeamMembershipProps = {
    id?: number;
    teamId: number;
    memberId: number;
    isPrimary?: boolean | null;
    createdAt?: Date;
    user?: UserDomain;
};

export class TeamMembershipDomain {
    readonly id?: number;
    readonly teamId: number;
    readonly memberId: number;
    readonly isPrimary: boolean;
    readonly createdAt?: Date;
    readonly user?: UserDomain;

    private constructor(props: TeamMembershipProps) {
        this.id = props.id;
        this.teamId = props.teamId;
        this.memberId = props.memberId;
        this.isPrimary = props.isPrimary ?? false;
        this.createdAt = props.createdAt;
        this.user = props.user;
    }

    static create(props: TeamMembershipProps): TeamMembershipDomain {
        return new TeamMembershipDomain(props);
    }

    withUser(user: UserDomain): TeamMembershipDomain {
        return new TeamMembershipDomain({ ...this, user });
    }
}
