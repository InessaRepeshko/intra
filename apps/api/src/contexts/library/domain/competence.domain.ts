export type CompetenceProps = {
    id?: number;
    code?: string | null;
    title: string;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export class CompetenceDomain {
    readonly id?: number;
    readonly code: string | null;
    readonly title: string;
    readonly description: string | null;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    private constructor(props: CompetenceProps) {
        this.id = props.id;
        this.code = props.code ?? null;
        this.title = props.title;
        this.description = props.description ?? null;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static create(props: CompetenceProps): CompetenceDomain {
        return new CompetenceDomain(props);
    }
}
