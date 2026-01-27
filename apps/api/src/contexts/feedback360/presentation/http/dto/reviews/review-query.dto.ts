import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { ReviewStage, ReviewSortField, SortDirection, REVIEW_CONSTRAINTS } from '@intra/shared-kernel';

export class ReviewQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Ratee id', type: 'number' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  rateeId?: number;

  @ApiPropertyOptional({ example: 'Valerii Velichko', description: 'Ratee full name (contains, case-insensitive)', type: 'string', minimum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN, maximum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX })
  @ToOptionalTrimmedString({ min: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN, max: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX })
  @IsOptional()
  @IsString()
  @MinLength(REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN)
  @MaxLength(REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX)
  rateeFullName?: string;

  @ApiPropertyOptional({ example: 1, description: 'Ratee position id', type: 'number' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  rateePositionId?: number;

  @ApiPropertyOptional({ example: 'Software Engineer', description: 'Ratee position title (contains, case-insensitive)', type: 'string', minimum: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN, maximum: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX })
  @ToOptionalTrimmedString({ min: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN, max: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX })
  @IsOptional()
  @IsString()
  @MinLength(REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN)
  @MaxLength(REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX)
  rateePositionTitle?: string;

  @ApiPropertyOptional({ example: 2, description: 'HR id', type: 'number' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  hrId?: number;

  @ApiPropertyOptional({ example: 'Anna Boyko', description: 'HR full name (contains, case-insensitive)', type: 'string', minimum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN, maximum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX })
  @ToOptionalTrimmedString({ min: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN, max: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX })
  @IsOptional()
  @IsString()
  @MinLength(REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN)
  @MaxLength(REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX)
  hrFullName?: string;

  @ApiPropertyOptional({ example: 'Completion of probationary period', description: 'HR note (contains, case-insensitive)', type: 'string', minimum: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MIN, maximum: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MAX })
  @ToOptionalTrimmedString({ min: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MIN, max: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MAX })
  @IsOptional()
  @IsString()
  @MinLength(REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MIN)
  @MaxLength(REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MAX)
  hrNote?: string;

  @ApiPropertyOptional({ example: 1, description: 'Team id', type: 'number', nullable: true })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  teamId?: number | null;

  @ApiPropertyOptional({ example: 'Engineering team', description: 'Team title (contains, case-insensitive)', type: 'string', minimum: REVIEW_CONSTRAINTS.TEAM_TITLE.LENGTH.MIN, maximum: REVIEW_CONSTRAINTS.TEAM_TITLE.LENGTH.MAX, nullable: true })
  @ToOptionalTrimmedString({ min: REVIEW_CONSTRAINTS.TEAM_TITLE.LENGTH.MIN, max: REVIEW_CONSTRAINTS.TEAM_TITLE.LENGTH.MAX })
  @IsOptional()
  @IsString()
  @MinLength(REVIEW_CONSTRAINTS.TEAM_TITLE.LENGTH.MIN)
  @MaxLength(REVIEW_CONSTRAINTS.TEAM_TITLE.LENGTH.MAX)
  teamTitle?: string | null;

  @ApiPropertyOptional({ example: 1, description: 'Manager id', type: 'number', nullable: true })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  managerId?: number | null;

  @ApiPropertyOptional({ example: 'Yaroslav Syvyi', description: 'Manager full name (contains, case-insensitive)', type: 'string', minimum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN, maximum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX, nullable: true })
  @ToOptionalTrimmedString({ min: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN, max: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX })
  @IsOptional()
  @IsString()
  @MinLength(REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN)
  @MaxLength(REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX)
  managerFullName?: string | null;

  @ApiPropertyOptional({ example: 1, description: 'Manager position id', type: 'number', nullable: true })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  managerPositionId?: number | null;

  @ApiPropertyOptional({ example: 'Software Engineer', description: 'Manager position title (contains, case-insensitive)', type: 'string', minimum: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN, maximum: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX, nullable: true })
  @ToOptionalTrimmedString({ min: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN, max: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX })
  @IsOptional()
  @IsString()
  @MinLength(REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN)
  @MaxLength(REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX)
  managerPositionTitle?: string | null;

  @ApiPropertyOptional({ example: 1, description: 'Cycle id', type: 'number', nullable: true })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  cycleId?: number | null;

  @ApiPropertyOptional({ enum: ReviewStage, example: ReviewStage.VERIFICATION_BY_HR, description: 'Review stage' })
  @ToOptionalEnum(ReviewStage)
  @IsOptional()
  @IsEnum(ReviewStage)
  stage?: ReviewStage;

  @ApiPropertyOptional({ example: 1, description: 'Report id', type: 'number', nullable: true })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  reportId?: number | null;

  @ApiPropertyOptional({ example: ReviewSortField.CREATED_AT, enum: ReviewSortField, description: 'Sort by', default: ReviewSortField.ID, type: 'string' })
  @ToOptionalEnum(ReviewSortField)
  @IsOptional()
  @IsEnum(ReviewSortField)
  sortBy?: ReviewSortField;

  @ApiPropertyOptional({ example: SortDirection.DESC, enum: SortDirection, description: 'Sort direction', default: SortDirection.ASC, type: 'string' })
  @ToOptionalEnum(SortDirection)
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}
