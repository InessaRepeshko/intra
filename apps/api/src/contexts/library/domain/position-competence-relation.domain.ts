export type PositionCompetenceRelationProps = {
    id?: number;
    positionId: number;
    competenceId: number;
    createdAt?: Date;
};

export class PositionCompetenceRelationDomain {
    readonly id?: number;
    readonly positionId: number;
    readonly competenceId: number;
    readonly createdAt?: Date;

    private constructor(props: PositionCompetenceRelationProps) {
        this.id = props.id;
        this.positionId = props.positionId;
        this.competenceId = props.competenceId;
        this.createdAt = props.createdAt;
    }

    static create(
        props: PositionCompetenceRelationProps,
    ): PositionCompetenceRelationDomain {
        return new PositionCompetenceRelationDomain(props);
    }
}
