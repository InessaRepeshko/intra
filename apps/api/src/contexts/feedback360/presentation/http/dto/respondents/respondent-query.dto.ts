import { RespondentCategory, ResponseStatus, SortDirection } from "@intra/shared-kernel";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEnum, IsInt, IsOptional, IsString, MinLength, MaxLength } from "class-validator";
import { ToOptionalDate, ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from "src/common/transforms/query-sanitize.transform";
import { RESPONDENT_CONSTRAINTS } from "@intra/shared-kernel";
import { RespondentSortField } from "src/contexts/feedback360/application/ports/respondent.repository.port";

export class RespondentQueryDto {
    @ApiPropertyOptional({ example: 1, description: 'Filter by cycle id', type: 'number' })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    reviewId?: number;

    @ApiPropertyOptional({ example: 1, description: 'Filter by respondent id', type: 'number' })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    respondentId?: number;

    @ApiPropertyOptional({ example: RespondentCategory.TEAM, description: 'Filter by respondent category', type: 'string' })
    @ToOptionalEnum(RespondentCategory)
    @IsOptional()
    @IsEnum(RespondentCategory)
    category?: RespondentCategory;

    @ApiPropertyOptional({ example: ResponseStatus.PENDING, description: 'Filter by response status', type: 'string' })
    @ToOptionalEnum(ResponseStatus)
    @IsOptional()
    @IsEnum(ResponseStatus)
    responseStatus?: ResponseStatus;

    @ApiPropertyOptional({ example: 'Respondent note', description: 'Filter by respondent note (contains, case-insensitive)', type: 'string', minLength: RESPONDENT_CONSTRAINTS.RESPONDENT_NOTE.LENGTH.MIN, maxLength: RESPONDENT_CONSTRAINTS.RESPONDENT_NOTE.LENGTH.MAX })
    @ToOptionalTrimmedString({ min: RESPONDENT_CONSTRAINTS.RESPONDENT_NOTE.LENGTH.MIN, max: RESPONDENT_CONSTRAINTS.RESPONDENT_NOTE.LENGTH.MAX })
    @IsOptional()
    @IsString()
    @MinLength(RESPONDENT_CONSTRAINTS.RESPONDENT_NOTE.LENGTH.MIN)
    @MaxLength(RESPONDENT_CONSTRAINTS.RESPONDENT_NOTE.LENGTH.MAX)
    respondentNote?: string;

    @ApiPropertyOptional({ example: 'HR note', description: 'Filter by HR note (contains, case-insensitive)', type: 'string', minLength: RESPONDENT_CONSTRAINTS.HR_NOTE.LENGTH.MIN, maxLength: RESPONDENT_CONSTRAINTS.HR_NOTE.LENGTH.MAX })
    @ToOptionalTrimmedString({ min: RESPONDENT_CONSTRAINTS.HR_NOTE.LENGTH.MIN, max: RESPONDENT_CONSTRAINTS.HR_NOTE.LENGTH.MAX })
    @IsOptional()
    @IsString()
    @MinLength(RESPONDENT_CONSTRAINTS.HR_NOTE.LENGTH.MIN)
    @MaxLength(RESPONDENT_CONSTRAINTS.HR_NOTE.LENGTH.MAX)
    hrNote?: string;

    @ApiPropertyOptional({ example: 1, description: 'Filter by position id', type: 'number' })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    positionId?: number;

    @ApiPropertyOptional({ example: 'Position title', description: 'Filter by position title (contains, case-insensitive)', type: 'string', minLength: RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN, maxLength: RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX })
    @ToOptionalTrimmedString({ min: RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN, max: RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX })
    @IsOptional()
    @IsString()
    @MinLength(RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN)
    @MaxLength(RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX)
    positionTitle?: string;

    @ApiPropertyOptional({ example: '2025-01-20T00:00:00.000Z', description: 'Filter by invited at', type: 'string', format: 'date-time' })
    @ToOptionalDate()
    @IsOptional()
    @IsDate()
    invitedAt?: Date;

    @ApiPropertyOptional({ example: '2025-01-20T00:00:00.000Z', description: 'Filter by canceled at', type: 'string', format: 'date-time' })
    @ToOptionalDate()
    @IsOptional()
    @IsDate()
    canceledAt?: Date;

    @ApiPropertyOptional({ example: '2025-01-20T00:00:00.000Z', description: 'Filter by responded at', type: 'string', format: 'date-time' })
    @ToOptionalDate()
    @IsOptional()
    @IsDate()
    respondedAt?: Date;

    @ApiPropertyOptional({ enum: RespondentSortField, example: RespondentSortField.RESPONSE_STATUS, description: 'Sort by field', default: RespondentSortField.ID, type: 'string' })
    @ToOptionalEnum(RespondentSortField)
    @IsOptional()
    @IsEnum(RespondentSortField)
    sortBy?: RespondentSortField;

    @ApiPropertyOptional({ enum: SortDirection, example: SortDirection.DESC, description: 'Sort direction', default: SortDirection.ASC, type: 'string' })
    @ToOptionalEnum(SortDirection)
    @IsOptional()
    @IsEnum(SortDirection)
    sortDirection?: SortDirection;
}