import {
    ANSWER_CONSTRAINTS,
    AnswerType,
    RespondentCategory,
} from '@intra/shared-kernel';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import {
    ToOptionalEnum,
    ToOptionalInt,
    ToOptionalTrimmedString,
} from 'src/common/transforms/query-sanitize.transform';

export class CreateAnswerDto {
    @ApiProperty({
        example: 12,
        description: 'Question id from review',
        type: 'number',
        required: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    questionId!: number;

    @ApiProperty({
        enum: RespondentCategory,
        example: RespondentCategory.TEAM,
        description: 'Respondent category',
        type: 'string',
        required: true,
    })
    @ToOptionalEnum(RespondentCategory)
    @IsEnum(RespondentCategory)
    respondentCategory!: RespondentCategory;

    @ApiProperty({
        enum: AnswerType,
        example: AnswerType.NUMERICAL_SCALE,
        description: 'Answer type',
        type: 'string',
        required: true,
    })
    @ToOptionalEnum(AnswerType)
    @IsEnum(AnswerType)
    answerType!: AnswerType;

    @ApiPropertyOptional({
        example: 4,
        description: 'Numerical score',
        type: 'number',
        minimum: ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MIN,
        maximum: ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MAX,
        required: false,
    })
    @ToOptionalInt({
        min: ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MIN,
        max: ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MAX,
    })
    @IsOptional()
    @IsInt()
    @Min(ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MIN)
    @Max(ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MAX)
    numericalValue?: number;

    @ApiPropertyOptional({
        example: 'Good progress',
        description: 'Text answer',
        type: 'string',
        minimum: ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MIN,
        maximum: ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MAX,
        required: false,
    })
    @ToOptionalTrimmedString({
        min: ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MIN,
        max: ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MAX,
    })
    @IsOptional()
    @IsString()
    @MinLength(ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MIN)
    @MaxLength(ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MAX)
    textValue?: string;
}
