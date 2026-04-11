import { SortDirection, StrategicReportSortField } from '@intra/shared-kernel';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
} from 'class-validator';
import {
    ToOptionalDate,
    ToOptionalEnum,
    ToOptionalInt,
} from 'src/common/transforms/query-sanitize.transform';

export class StrategicReportQueryDto {
    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by Feedback360 cycle identifier',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    cycleId?: number;

    @ApiPropertyOptional({
        example: 'Annual review 2025',
        description: 'Filter by Feedback360 cycle title',
        type: 'string',
    })
    @IsOptional()
    @IsString()
    cycleTitle?: string;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by Feedback360 ratee count',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    rateeCount?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by Feedback360 respondent count',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    respondentCount?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by Feedback360 answer count',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    answerCount?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by Feedback360 reviewer count',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    reviewerCount?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by Feedback360 team count',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    teamCount?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by Feedback360 position count',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    positionCount?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by Feedback360 competence count',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceCount?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by Feedback360 question count',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    questionCount?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by ratee turnout percentage',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    turnoutPctOfRatees?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by respondent turnout percentage',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    turnoutPctOfRespondents?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence general average self',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceGeneralAvgSelf?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence general average team',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceGeneralAvgTeam?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence general average other',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceGeneralAvgOther?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence general percentage self',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceGeneralPctSelf?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence general percentage team',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceGeneralPctTeam?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence general percentage other',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceGeneralPctOther?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence general delta team',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceGeneralDeltaTeam?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence general delta other',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceGeneralDeltaOther?: number;

    @ApiPropertyOptional({
        description: 'Filter by creation date',
        example: '2025-01-01T00:00:00.000Z',
        type: 'string',
        format: 'date-time',
    })
    @ToOptionalDate()
    @IsOptional()
    createdAt?: Date;

    @ApiPropertyOptional({
        example: StrategicReportSortField.CYCLE_ID,
        enum: StrategicReportSortField,
        description: 'Sort by field',
        default: StrategicReportSortField.ID,
        type: 'string',
    })
    @ToOptionalEnum(StrategicReportSortField)
    @IsOptional()
    @IsEnum(StrategicReportSortField)
    sortBy?: StrategicReportSortField;

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
