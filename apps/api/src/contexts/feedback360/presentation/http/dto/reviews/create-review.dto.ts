import { REVIEW_CONSTRAINTS, ReviewStage } from '@intra/shared-kernel';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import {
    ToOptionalEnum,
    ToOptionalInt,
    ToOptionalTrimmedString,
} from 'src/common/transforms/query-sanitize.transform';

export class CreateReviewDto {
    @ApiProperty({
        example: 10,
        description: 'Ratee id',
        type: 'number',
        required: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    rateeId!: number;

    @ApiProperty({
        example: 'Valerii Velichko',
        description: 'Ratee full name',
        type: 'string',
        required: true,
        minimum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        maximum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        max: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
    })
    @IsString()
    @MinLength(REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN)
    @MaxLength(REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX)
    rateeFullName!: string;

    @ApiProperty({
        example: 3,
        description: 'Ratee position id',
        type: 'number',
        required: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    rateePositionId!: number;

    @ApiProperty({
        example: 'Senior Engineer',
        description: 'Ratee position title',
        type: 'string',
        required: true,
        minimum: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN,
        maximum: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN,
        max: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX,
    })
    @IsString()
    @MinLength(REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN)
    @MaxLength(REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX)
    rateePositionTitle!: string;

    @ApiProperty({
        example: 2,
        description: 'HR, responsible for the process',
        type: 'number',
        required: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    hrId!: number;

    @ApiProperty({
        example: 'Anna Boyko',
        description: 'HR full name',
        type: 'string',
        required: true,
        minimum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        maximum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        max: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
    })
    @IsString()
    @MinLength(REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN)
    @MaxLength(REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX)
    hrFullName!: string;

    @ApiPropertyOptional({
        example: 'Completion of probationary period',
        description: 'HR note',
        type: 'string',
        required: false,
        minimum: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MIN,
        maximum: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MIN,
        max: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MAX,
    })
    @IsOptional()
    @IsString()
    @MinLength(REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MIN)
    @MaxLength(REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MAX)
    hrNote?: string;

    @ApiPropertyOptional({
        example: 5,
        description: 'Team id',
        type: 'number',
        required: false,
        nullable: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    teamId?: number | null;

    @ApiPropertyOptional({
        example: 'Engineering team',
        description: 'Team title',
        type: 'string',
        required: false,
        minimum: REVIEW_CONSTRAINTS.TEAM_TITLE.LENGTH.MIN,
        maximum: REVIEW_CONSTRAINTS.TEAM_TITLE.LENGTH.MAX,
        nullable: true,
    })
    @ToOptionalTrimmedString()
    @IsOptional()
    @IsString()
    teamTitle?: string | null;

    @ApiPropertyOptional({
        example: 12,
        description: 'Ratee manager',
        type: 'number',
        required: false,
        nullable: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    managerId?: number | null;

    @ApiPropertyOptional({
        example: 'Yaroslav Syvyi',
        description: 'Manager full name',
        type: 'string',
        required: false,
        minimum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        maximum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
        nullable: true,
    })
    @ToOptionalTrimmedString({
        min: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        max: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
    })
    @IsOptional()
    @IsString()
    @MinLength(REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN)
    @MaxLength(REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX)
    managerFullName?: string | null;

    @ApiPropertyOptional({
        example: 1,
        description: 'Manager position id',
        type: 'number',
        required: false,
        nullable: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    managerPositionId?: number | null;

    @ApiPropertyOptional({
        example: 'Senior Engineer',
        description: 'Manager position title',
        type: 'string',
        required: false,
        minimum: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN,
        maximum: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX,
        nullable: true,
    })
    @ToOptionalTrimmedString({
        min: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN,
        max: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX,
    })
    @IsOptional()
    @IsString()
    @MinLength(REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN)
    @MaxLength(REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX)
    managerPositionTitle?: string | null;

    @ApiPropertyOptional({
        example: 1,
        description: 'Attached cycle',
        type: 'number',
        required: false,
        nullable: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    cycleId?: number | null;

    @ApiPropertyOptional({
        enum: ReviewStage,
        example: ReviewStage.VERIFICATION_BY_HR,
        description: 'Review stage',
        type: 'string',
        required: false,
    })
    @ToOptionalEnum(ReviewStage)
    @IsOptional()
    @IsEnum(ReviewStage)
    stage?: ReviewStage;

    @ApiPropertyOptional({
        example: 1,
        description: 'Attached report',
        type: 'number',
        required: false,
        nullable: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    reportId?: number | null;
}
