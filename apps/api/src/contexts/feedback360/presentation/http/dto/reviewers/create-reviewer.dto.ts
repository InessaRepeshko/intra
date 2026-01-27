import { REVIEWER_CONSTRAINTS } from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';
import {
    ToOptionalInt,
    ToOptionalTrimmedString,
} from 'src/common/transforms/query-sanitize.transform';

export class CreateReviewerDto {
    @ApiProperty({
        example: 4,
        description: 'Reviewer id',
        type: 'number',
        required: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    reviewerId!: number;

    @ApiProperty({
        example: 'Ivanna Bulava',
        description: 'Reviewer full name',
        type: 'string',
        required: true,
        minimum: REVIEWER_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        maximum: REVIEWER_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: REVIEWER_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        max: REVIEWER_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
    })
    @IsString()
    @MinLength(REVIEWER_CONSTRAINTS.FULL_NAME.LENGTH.MIN)
    @MaxLength(REVIEWER_CONSTRAINTS.FULL_NAME.LENGTH.MAX)
    fullName!: string;

    @ApiProperty({
        example: 3,
        description: 'Reviewer position id',
        type: 'number',
        required: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    positionId!: number;

    @ApiProperty({
        example: 'Team Lead',
        description: 'Reviewer position title',
        type: 'string',
        required: true,
        minimum: REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN,
        maximum: REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN,
        max: REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX,
    })
    @IsString()
    @MinLength(REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN)
    @MaxLength(REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX)
    positionTitle!: string;

    @ApiProperty({
        example: 5,
        description: 'Reviewer team id',
        type: 'number',
        required: false,
        nullable: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    teamId?: number | null;

    @ApiProperty({
        example: 'Engineering team',
        description: 'Reviewer team title',
        type: 'string',
        required: false,
        nullable: true,
        minimum: REVIEWER_CONSTRAINTS.TEAM_TITLE.LENGTH.MIN,
        maximum: REVIEWER_CONSTRAINTS.TEAM_TITLE.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: REVIEWER_CONSTRAINTS.TEAM_TITLE.LENGTH.MIN,
        max: REVIEWER_CONSTRAINTS.TEAM_TITLE.LENGTH.MAX,
    })
    @IsString()
    @MinLength(REVIEWER_CONSTRAINTS.TEAM_TITLE.LENGTH.MIN)
    @MaxLength(REVIEWER_CONSTRAINTS.TEAM_TITLE.LENGTH.MAX)
    teamTitle?: string | null;
}
