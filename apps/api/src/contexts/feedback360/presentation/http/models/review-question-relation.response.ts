import {
    AnswerType,
    REVIEW_QUESTION_RELATION_CONSTRAINTS,
    ReviewQuestionRelationDto,
} from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReviewQuestionRelationResponse implements ReviewQuestionRelationDto {
    @ApiProperty({
        example: 1,
        description: 'Review question relation id',
        type: 'number',
        required: true,
    })
    @Expose()
    id!: number;

    @ApiProperty({
        example: 2,
        description: 'Review id',
        type: 'number',
        required: true,
    })
    @Expose()
    reviewId!: number;

    @ApiProperty({
        example: 10,
        description: 'Question id',
        type: 'number',
        required: true,
    })
    @Expose()
    questionId!: number;

    @ApiProperty({
        example: 'Listens actively before responding.',
        description: 'Question title',
        type: 'string',
        required: true,
        minimum: REVIEW_QUESTION_RELATION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MIN,
        maximum: REVIEW_QUESTION_RELATION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MAX,
    })
    @Expose()
    questionTitle!: string;

    @ApiProperty({
        enum: AnswerType,
        example: AnswerType.NUMERICAL_SCALE,
        description: 'Answer type',
        type: 'string',
        required: true,
    })
    @Expose()
    answerType!: AnswerType;

    @ApiProperty({
        example: false,
        description: 'Is for selfassessment',
        type: 'boolean',
        required: false,
        nullable: true,
    })
    @Expose()
    isForSelfassessment?: boolean | null;

    @ApiProperty({
        example: 3,
        description: 'Competence id',
        type: 'number',
        required: true,
    })
    @Expose()
    competenceId!: number;

    @ApiProperty({
        example: 'Communication',
        description: 'Competence title',
        type: 'string',
        required: true,
        minimum:
            REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_TITLE.LENGTH.MIN,
        maximum:
            REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_TITLE.LENGTH.MAX,
    })
    @Expose()
    competenceTitle!: string;

    @ApiProperty({
        example: 'COMM',
        description: 'Competence code',
        type: 'string',
        required: false,
        nullable: true,
        minimum:
            REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_CODE.LENGTH.MIN,
        maximum:
            REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_CODE.LENGTH.MAX,
    })
    @Expose()
    competenceCode?: string | null;

    @ApiProperty({
        example: 'Communication',
        description: 'Competence description',
        type: 'string',
        required: false,
        nullable: true,
    })
    @Expose()
    competenceDescription?: string | null;

    @ApiProperty({
        example: '2025-01-01T00:00:00.000Z',
        description: 'Created at',
        type: 'string',
        format: 'date-time',
    })
    @Expose()
    createdAt!: Date;
}
