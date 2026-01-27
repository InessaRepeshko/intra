export type PositionHierarchyProps = {
    id?: number;
    superiorPositionId: number;
    subordinatePositionId: number;
    createdAt?: Date;
};

export class PositionHierarchyDomain {
    readonly id?: number;
    readonly superiorPositionId: number;
    readonly subordinatePositionId: number;
    readonly createdAt?: Date;

    private constructor(props: PositionHierarchyProps) {
        this.id = props.id;
        this.superiorPositionId = props.superiorPositionId;
        this.subordinatePositionId = props.subordinatePositionId;
        this.createdAt = props.createdAt;
    }

    static create(props: PositionHierarchyProps): PositionHierarchyDomain {
        return new PositionHierarchyDomain(props);
    }
}
