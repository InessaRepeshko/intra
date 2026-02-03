import { AnswerType, QUESTION_CONSTRAINTS } from '@intra/shared-kernel';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import {
    ToOptionalBool,
    ToOptionalEnum,
    ToOptionalInt,
    ToOptionalTrimmedString,
} from 'src/common/transforms/query-sanitize.transform';

export class CreateQuestionDto {
    @ApiPropertyOptional({
        example: 1,
        description: 'Cycle to which the question belongs',
        type: 'number',
        required: false,
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    cycleId?: number;

    @ApiPropertyOptional({
        example: 10,
        description: 'Base question from library (optional)',
        type: 'number',
        required: false,
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    questionTemplateId?: number;

    @ApiProperty({
        example: 'Listens actively before responding.',
        description: 'Question text',
        type: 'string',
        minimum: QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MIN,
        maximum: QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MAX,
        required: true,
    })
    @ToOptionalTrimmedString({
        min: QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MIN,
        max: QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MAX,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MIN)
    @MaxLength(QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MAX)
    title!: string;

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
        example: 3,
        description: 'Competence to which the question is linked',
        type: 'number',
        required: false,
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    competenceId?: number;

    @ApiPropertyOptional({
        example: false,
        description: 'Is for selfassessment',
        type: 'boolean',
        required: false,
    })
    @ToOptionalBool()
    @IsOptional()
    @IsBoolean()
    isForSelfassessment?: boolean;
}
