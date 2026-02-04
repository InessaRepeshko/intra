import {
    CommentSentiment,
    REPORT_COMMENT_CONSTRAINTS,
    RespondentCategory,
} from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class CreateReportCommentDto {
    @ApiProperty({
        example: 1,
        description: 'Report id',
        type: 'number',
        required: true,
    })
    @IsInt()
    reportId!: number;

    @ApiProperty({
        example: 1,
        description: 'Question id',
        type: 'number',
        required: true,
    })
    @IsInt()
    questionId!: number;

    @ApiProperty({
        example: 'Question title',
        description: 'Question title',
        type: 'string',
        required: true,
        minimum: REPORT_COMMENT_CONSTRAINTS.TITLE.LENGTH.MIN,
        maximum: REPORT_COMMENT_CONSTRAINTS.TITLE.LENGTH.MAX,
    })
    @IsString()
    @IsNotEmpty()
    questionTitle!: string;

    @ApiProperty({
        example: 'Comment summary',
        description: 'Summarized comment',
        type: 'string',
        required: true,
        minimum: REPORT_COMMENT_CONSTRAINTS.COMMENT.LENGTH.MIN,
        maximum: REPORT_COMMENT_CONSTRAINTS.COMMENT.LENGTH.MAX,
    })
    @IsString()
    @IsNotEmpty()
    comment!: string;

    @ApiProperty({
        enum: RespondentCategory,
        isArray: true,
        example: [RespondentCategory.TEAM],
        description: 'Respondent categories who mentioned this comment',
        required: true,
    })
    @IsArray()
    @ArrayMinSize(1)
    @IsEnum(RespondentCategory, { each: true })
    respondentCategories!: RespondentCategory[];

    @ApiProperty({
        enum: CommentSentiment,
        description: 'Sentiment of the comment',
        required: false,
    })
    @IsEnum(CommentSentiment)
    @IsOptional()
    commentSentiment?: CommentSentiment;

    @ApiProperty({
        example: 3,
        description: 'Number of mentions',
        type: 'number',
        required: true,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    numberOfMentions!: number;
}
