import {
    AnswerType,
    REVIEW_QUESTION_RELATION_CONSTRAINTS,
    ReviewQuestionRelationSortField,
    SortDirection,
} from '@intra/shared-kernel';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import {
    ToOptionalBool,
    ToOptionalEnum,
    ToOptionalInt,
    ToOptionalTrimmedString,
} from 'src/common/transforms/query-sanitize.transform';

export class ReviewQuestionRelationQueryDto {
    @ApiPropertyOptional({
        example: 1,
        description: 'Review id',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    reviewId?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Question id',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    questionId?: number;

    @ApiPropertyOptional({
        example: 'Listens actively before responding.',
        description: 'Question title (contains, case-insensitive)',
        type: 'string',
        minimum: REVIEW_QUESTION_RELATION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MIN,
        maximum: REVIEW_QUESTION_RELATION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: REVIEW_QUESTION_RELATION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MIN,
        max: REVIEW_QUESTION_RELATION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MAX,
    })
    @IsOptional()
    @IsString()
    @MinLength(REVIEW_QUESTION_RELATION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MIN)
    @MaxLength(REVIEW_QUESTION_RELATION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MAX)
    questionTitle?: string;

    @ApiPropertyOptional({
        example: AnswerType.NUMERICAL_SCALE,
        description: 'Answer type',
        type: 'string',
    })
    @ToOptionalEnum(AnswerType)
    @IsOptional()
    @IsEnum(AnswerType)
    answerType?: AnswerType;

    @ApiPropertyOptional({
        example: true,
        description: 'Is for selfassessment',
        type: 'boolean',
    })
    @ToOptionalBool()
    @IsOptional()
    @IsBoolean()
    isForSelfassessment?: boolean;

    @ApiPropertyOptional({
        example: 1,
        description: 'Competence id',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    competenceId?: number;

    @ApiPropertyOptional({
        example: 'Communication',
        description: 'Competence title (contains, case-insensitive)',
        type: 'string',
        minimum:
            REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_TITLE.LENGTH.MIN,
        maximum:
            REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_TITLE.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_TITLE.LENGTH.MIN,
        max: REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_TITLE.LENGTH.MAX,
    })
    @IsOptional()
    @IsString()
    @MinLength(REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_TITLE.LENGTH.MIN)
    @MaxLength(REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_TITLE.LENGTH.MAX)
    competenceTitle?: string;

    @ApiPropertyOptional({
        example: 'COMM',
        description: 'Competence code (contains, case-insensitive)',
        type: 'string',
        minimum:
            REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_CODE.LENGTH.MIN,
        maximum:
            REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_CODE.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_CODE.LENGTH.MIN,
        max: REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_CODE.LENGTH.MAX,
    })
    @IsOptional()
    @IsString()
    @MinLength(REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_CODE.LENGTH.MIN)
    @MaxLength(REVIEW_QUESTION_RELATION_CONSTRAINTS.COMPETENCE_CODE.LENGTH.MAX)
    competenceCode?: string;

    @ApiPropertyOptional({
        example: 'Communication',
        description: 'Competence description (contains, case-insensitive)',
        type: 'string',
    })
    @ToOptionalTrimmedString()
    @IsOptional()
    @IsString()
    competenceDescription?: string;

    @ApiPropertyOptional({
        example: ReviewQuestionRelationSortField.QUESTION_TITLE,
        enum: ReviewQuestionRelationSortField,
        description: 'Sort field by ',
        type: 'string',
        default: ReviewQuestionRelationSortField.ID,
    })
    @ToOptionalEnum(ReviewQuestionRelationSortField)
    @IsOptional()
    @IsEnum(ReviewQuestionRelationSortField)
    sortBy?: ReviewQuestionRelationSortField;

    @ApiPropertyOptional({
        example: SortDirection.DESC,
        enum: SortDirection,
        description: 'Sort direction',
        type: 'string',
        default: SortDirection.ASC,
    })
    @ToOptionalEnum(SortDirection)
    @IsOptional()
    @IsEnum(SortDirection)
    sortDirection?: SortDirection;
}
