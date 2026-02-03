export type TeamProps = {
    id?: number;
    title: string;
    description?: string | null;
    headId?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export class TeamDomain {
    readonly id?: number;
    readonly title: string;
    readonly description: string | null;
    readonly headId: number | null;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    private constructor(props: TeamProps) {
        this.id = props.id;
        this.title = props.title;
        this.description = props.description ?? null;
        this.headId = props.headId ?? null;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static create(props: TeamProps): TeamDomain {
        return new TeamDomain(props);
    }

    withPatch(patch: Partial<TeamProps>): TeamDomain {
        return new TeamDomain({ ...this, ...patch });
    }
}
