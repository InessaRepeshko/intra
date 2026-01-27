import {
    CYCLE_CONSTRAINTS,
    CycleSortField,
    CycleStage,
    SortDirection,
} from '@intra/shared-kernel';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsDate,
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
    ToOptionalDate,
    ToOptionalEnum,
    ToOptionalInt,
    ToOptionalTrimmedString,
} from 'src/common/transforms/query-sanitize.transform';

export class CycleQueryDto {
    @ApiPropertyOptional({
        description: 'Filter by title',
        example: 'Q1',
        type: 'string',
        minimum: CYCLE_CONSTRAINTS.TITLE.LENGTH.MIN,
        maximum: CYCLE_CONSTRAINTS.TITLE.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: CYCLE_CONSTRAINTS.TITLE.LENGTH.MIN,
        max: CYCLE_CONSTRAINTS.TITLE.LENGTH.MAX,
    })
    @IsOptional()
    @IsString()
    @MinLength(CYCLE_CONSTRAINTS.TITLE.LENGTH.MIN)
    @MaxLength(CYCLE_CONSTRAINTS.TITLE.LENGTH.MAX)
    title?: string;

    @ApiPropertyOptional({
        description: 'Filter by description',
        example: 'Description',
        type: 'string',
        minimum: CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        maximum: CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        max: CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @IsOptional()
    @IsString()
    @MinLength(CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
    @MaxLength(CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
    description?: string;

    @ApiPropertyOptional({
        description: 'Search by title/description',
        example: 'Q1',
        type: 'string',
        minimum: CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        maximum: CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        max: CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @IsOptional()
    @IsString()
    @MinLength(CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
    @MaxLength(CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
    search?: string;

    @ApiPropertyOptional({
        description: 'Filter by HR ID',
        example: 2,
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    hrId?: number;

    @ApiPropertyOptional({
        example: 5,
        default: CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN,
        description: 'Filter by min respondents threshold',
        type: 'number',
        minimum: CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN,
    })
    @ToOptionalInt({ min: CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN })
    @IsOptional()
    @IsInt()
    @Min(CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN)
    minRespondentsThreshold?: number;

    @ApiPropertyOptional({
        enum: CycleStage,
        example: CycleStage.ACTIVE,
        description: 'Filter by stage',
        type: 'string',
    })
    @ToOptionalEnum(CycleStage)
    @IsOptional()
    @IsEnum(CycleStage)
    stage?: CycleStage;

    @ApiPropertyOptional({
        example: true,
        description: 'Filter by active',
        type: 'boolean',
    })
    @ToOptionalBool()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({
        description: 'Filter by start date',
        example: '2025-01-01T00:00:00.000Z',
        type: 'string',
        format: 'date-time',
    })
    @ToOptionalDate()
    @IsOptional()
    @IsDate()
    startDate?: Date;

    @ApiPropertyOptional({
        description: 'Filter by end date',
        example: '2025-01-01T00:00:00.000Z',
        type: 'string',
        format: 'date-time',
    })
    @ToOptionalDate()
    @IsOptional()
    @IsDate()
    endDate?: Date;

    @ApiPropertyOptional({
        description: 'Filter by review deadline',
        example: '2025-01-01T00:00:00.000Z',
        type: 'string',
        format: 'date-time',
    })
    @ToOptionalDate()
    @IsOptional()
    @IsDate()
    reviewDeadline?: Date;

    @ApiPropertyOptional({
        description: 'Filter by approval deadline',
        example: '2025-01-01T00:00:00.000Z',
        type: 'string',
        format: 'date-time',
    })
    @ToOptionalDate()
    @IsOptional()
    @IsDate()
    approvalDeadline?: Date;

    @ApiPropertyOptional({
        description: 'Filter by response deadline',
        example: '2025-01-01T00:00:00.000Z',
        type: 'string',
        format: 'date-time',
    })
    @ToOptionalDate()
    @IsOptional()
    @IsDate()
    responseDeadline?: Date;

    @ApiPropertyOptional({
        example: CycleSortField.STAGE,
        enum: CycleSortField,
        description: 'Sort by field',
        default: CycleSortField.ID,
        type: 'string',
    })
    @ToOptionalEnum(CycleSortField)
    @IsOptional()
    @IsEnum(CycleSortField)
    sortBy?: CycleSortField;

    @ApiPropertyOptional({
        example: SortDirection.DESC,
        enum: SortDirection,
        description: 'Sort direction',
        default: SortDirection.ASC,
        type: 'string',
    })
    @ToOptionalEnum(SortDirection)
    @IsOptional()
    @IsEnum(SortDirection)
    sortDirection?: SortDirection;
}
