import {
    CommentSentiment,
    REPORT_COMMENT_CONSTRAINTS,
    ReportCommentDto,
    RespondentCategory,
} from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReportCommentResponse implements ReportCommentDto {
    @ApiProperty({
        example: 1,
        description: 'Comment id',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    id!: number;

    @ApiProperty({
        example: 1,
        description: 'Report id',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    reportId!: number;

    @ApiProperty({
        example: 1,
        description: 'Question id',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    questionId!: number;

    @ApiProperty({
        example: 'Question title',
        description: 'Question title',
        type: 'string',
        required: true,
        nullable: false,
        minimum: REPORT_COMMENT_CONSTRAINTS.TITLE.LENGTH.MIN,
        maximum: REPORT_COMMENT_CONSTRAINTS.TITLE.LENGTH.MAX,
    })
    @Expose()
    questionTitle!: string;

    @ApiProperty({
        example: 'Comment',
        description: 'Comment',
        type: 'string',
        required: true,
        nullable: false,
        minimum: REPORT_COMMENT_CONSTRAINTS.COMMENT.LENGTH.MIN,
        maximum: REPORT_COMMENT_CONSTRAINTS.COMMENT.LENGTH.MAX,
    })
    @Expose()
    comment!: string;

    @ApiProperty({
        enum: RespondentCategory,
        description: 'Respondent categories',
        type: 'array',
        isArray: true,
        required: true,
        nullable: false,
    })
    @Expose()
    respondentCategories!: RespondentCategory[];

    @ApiProperty({
        enum: CommentSentiment,
        description: 'Comment sentiment',
        type: 'string',
        required: false,
        nullable: true,
    })
    @Expose()
    commentSentiment?: CommentSentiment | null;

    @ApiProperty({
        example: 3,
        description: 'Number of mentions',
        type: 'number',
        required: true,
        nullable: false,
        minimum: 1,
    })
    @Expose()
    numberOfMentions!: number;

    @ApiProperty({
        example: '2025-01-01T00:00:00.000Z',
        description: 'Created at',
        type: 'string',
        format: 'date-time',
    })
    @Expose()
    createdAt!: Date;
}
