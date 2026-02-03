import {
    AnswerType,
    QUESTION_TEMPLATE_CONSTRAINTS,
    QuestionTemplateSortField,
    QuestionTemplateStatus,
    SortDirection,
} from '@intra/shared-kernel';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
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
    ToOptionalIntArray,
    ToOptionalTrimmedString,
} from 'src/common/transforms/query-sanitize.transform';

export class QuestionTemplateQueryDto {
    @ApiPropertyOptional({
        description: 'Search in title',
        example: 'features',
        minimum: QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MIN,
        maximum: QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MAX,
        type: 'string',
        required: false,
    })
    @IsOptional()
    @ToOptionalTrimmedString({
        min: QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MIN,
        max: QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MAX,
    })
    @IsString()
    @MinLength(QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MIN)
    @MaxLength(QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MAX)
    title?: string;

    @ApiPropertyOptional({
        description: 'Filter by competence id',
        example: 2,
        type: 'number',
        required: false,
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    competenceId?: number;

    @ApiPropertyOptional({
        description: 'Filter by position id',
        example: [2, 3],
        type: 'number',
        isArray: true,
        required: false,
    })
    @ToOptionalIntArray()
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Min(1, { each: true })
    positionIds?: number[];

    @ApiPropertyOptional({
        enum: QuestionTemplateStatus,
        example: QuestionTemplateStatus.ACTIVE,
        type: 'string',
        required: false,
        description: 'Question template status',
    })
    @ToOptionalEnum(QuestionTemplateStatus)
    @IsOptional()
    @IsEnum(QuestionTemplateStatus)
    status?: QuestionTemplateStatus;

    @ApiPropertyOptional({
        enum: AnswerType,
        example: AnswerType.TEXT_FIELD,
        type: 'string',
        required: false,
        description: 'Answer type',
    })
    @ToOptionalEnum(AnswerType)
    @IsOptional()
    @IsEnum(AnswerType)
    answerType?: AnswerType;

    @ApiPropertyOptional({
        description: 'Filter self assessment question templates',
        example: false,
        type: 'boolean',
        required: false,
    })
    @ToOptionalBool()
    @IsOptional()
    @IsBoolean()
    isForSelfassessment?: boolean;

    @ApiPropertyOptional({
        enum: QuestionTemplateSortField,
        example: QuestionTemplateSortField.TITLE,
        type: 'string',
        required: false,
        description: 'Sort by field',
    })
    @ToOptionalEnum(QuestionTemplateSortField)
    @IsOptional()
    @IsEnum(QuestionTemplateSortField)
    sortBy?: QuestionTemplateSortField;

    @ApiPropertyOptional({
        enum: SortDirection,
        example: SortDirection.ASC,
        type: 'string',
        required: false,
        description: 'Sort direction',
    })
    @ToOptionalEnum(SortDirection)
    @IsOptional()
    @IsEnum(SortDirection)
    sortDirection?: SortDirection;
}
