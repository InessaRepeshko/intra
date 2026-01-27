import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { RespondentCategory, REVIEWER_CONSTRAINTS, SortDirection } from "@intra/shared-kernel";
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from "src/common/transforms/query-sanitize.transform";
import { ReviewerSortField } from "src/contexts/feedback360/application/ports/reviewer.repository.port";

export class ReviewerQueryDto {
    @ApiPropertyOptional({ example: 1, description: 'Review id', type: 'number' })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    reviewId?: number;

    @ApiPropertyOptional({ example: 1, description: 'Reviewer id', type: 'number' })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    reviewerId?: number;

    @ApiPropertyOptional({ example: 'Ivanna Bulava', description: 'Reviewer full name', type: 'string', minLength: REVIEWER_CONSTRAINTS.FULL_NAME.LENGTH.MIN, maxLength: REVIEWER_CONSTRAINTS.FULL_NAME.LENGTH.MAX })
    @ToOptionalTrimmedString({ min: REVIEWER_CONSTRAINTS.FULL_NAME.LENGTH.MIN, max: REVIEWER_CONSTRAINTS.FULL_NAME.LENGTH.MAX })
    @IsOptional()
    @IsString()
    @MinLength(REVIEWER_CONSTRAINTS.FULL_NAME.LENGTH.MIN)
    @MaxLength(REVIEWER_CONSTRAINTS.FULL_NAME.LENGTH.MAX)
    fullName?: string;

    @ApiPropertyOptional({ example: 1, description: 'Position id', type: 'number' })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    positionId?: number;

    @ApiPropertyOptional({ example: 'Position title', description: 'Position title (contains, case-insensitive)', type: 'string', minLength: REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN, maxLength: REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX })
    @ToOptionalTrimmedString({ min: REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN, max: REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX })
    @IsOptional()
    @IsString()
    @MinLength(REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN)
    @MaxLength(REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX)
    positionTitle?: string;

    @ApiPropertyOptional({ example: 1, description: 'Team id', type: 'number', nullable: true })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    teamId?: number | null;

    @ApiPropertyOptional({ example: 'Engineering team', description: 'Team title (contains, case-insensitive)', type: 'string', nullable: true, minLength: REVIEWER_CONSTRAINTS.TEAM_TITLE.LENGTH.MIN, maxLength: REVIEWER_CONSTRAINTS.TEAM_TITLE.LENGTH.MAX })
    @ToOptionalTrimmedString({ min: REVIEWER_CONSTRAINTS.TEAM_TITLE.LENGTH.MIN, max: REVIEWER_CONSTRAINTS.TEAM_TITLE.LENGTH.MAX })
    @IsOptional()
    @IsString()
    @MinLength(REVIEWER_CONSTRAINTS.TEAM_TITLE.LENGTH.MIN)
    @MaxLength(REVIEWER_CONSTRAINTS.TEAM_TITLE.LENGTH.MAX)
    teamTitle?: string | null;

    @ApiPropertyOptional({ example: ReviewerSortField.POSITION_TITLE, enum: ReviewerSortField, description: 'Sort field by ', type: 'string', default: ReviewerSortField.ID })
    @ToOptionalEnum(ReviewerSortField)
    @IsOptional()
    @IsEnum(ReviewerSortField)
    sortBy?: ReviewerSortField;

    @ApiPropertyOptional({ example: SortDirection.DESC, enum: SortDirection, description: 'Sort direction', type: 'string', default: SortDirection.ASC })
    @ToOptionalEnum(SortDirection)
    @IsOptional()
    @IsEnum(SortDirection)
    sortDirection?: SortDirection;
}