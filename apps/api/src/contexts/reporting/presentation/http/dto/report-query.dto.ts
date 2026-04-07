import {
    ReportSortField,
    RespondentCategory,
    SortDirection,
} from '@intra/shared-kernel';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsEnum,
    IsInt,
    IsOptional,
    IsPositive,
} from 'class-validator';
import {
    ToOptionalDate,
    ToOptionalEnum,
    ToOptionalInt,
} from 'src/common/transforms/query-sanitize.transform';

export class ReportQueryDto {
    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by Feedback360 review id',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    reviewId?: number;

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
        example: [RespondentCategory.SELF_ASSESSMENT, RespondentCategory.TEAM],
        description: 'Filter by Feedback360 respondent categories',
        type: 'array',
        items: {
            type: 'string',
            enum: [RespondentCategory],
        },
    })
    @IsOptional()
    @IsArray()
    @IsEnum(RespondentCategory, { each: true })
    respondentCategories?: RespondentCategory[];

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
        description: 'Filter by team turnout percentage',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    turnoutPctOfTeam?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by other peers turnout percentage',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    turnoutPctOfOther?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by question total average by self',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    questionTotAvgBySelf?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by question total average by team',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    questionTotAvgByTeam?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by question total average by others',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    questionTotAvgByOthers?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by question total percentage by self',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    questionTotPctBySelf?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by question total percentage by team',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    questionTotPctByTeam?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by question total percentage by others',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    questionTotPctByOthers?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by question total delta percentage by team',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    questionTotDeltaPctByTeam?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by question total delta percentage by others',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    questionTotDeltaPctByOthers?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence total average by self',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceTotAvgBySelf?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence total average by team',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceTotAvgByTeam?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence total average by others',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceTotAvgByOthers?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence total percentage by self',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceTotPctBySelf?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence total percentage by team',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceTotPctByTeam?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence total percentage by others',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceTotPctByOthers?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence total delta percentage by team',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceTotDeltaPctByTeam?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by competence total delta percentage by others',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    competenceTotDeltaPctByOthers?: number;

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
        example: ReportSortField.CYCLE_ID,
        enum: ReportSortField,
        description: 'Sort by field',
        default: ReportSortField.ID,
        type: 'string',
    })
    @ToOptionalEnum(ReportSortField)
    @IsOptional()
    @IsEnum(ReportSortField)
    sortBy?: ReportSortField;

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
