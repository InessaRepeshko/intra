export type PositionQuestionTemplateRelationProps = {
    id?: number;
    questionTemplateId: number;
    positionId: number;
    createdAt?: Date;
};

export class PositionQuestionTemplateRelationDomain {
    readonly id?: number;
    readonly questionTemplateId: number;
    readonly positionId: number;
    readonly createdAt?: Date;

    private constructor(props: PositionQuestionTemplateRelationProps) {
        this.id = props.id;
        this.questionTemplateId = props.questionTemplateId;
        this.positionId = props.positionId;
        this.createdAt = props.createdAt;
    }

    static create(
        props: PositionQuestionTemplateRelationProps,
    ): PositionQuestionTemplateRelationDomain {
        return new PositionQuestionTemplateRelationDomain(props);
    }
}
