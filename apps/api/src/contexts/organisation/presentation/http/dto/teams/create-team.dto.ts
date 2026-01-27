import { TEAM_CONSTRAINTS } from '@intra/shared-kernel';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import {
    ToOptionalInt,
    ToOptionalTrimmedString,
} from 'src/common/transforms/query-sanitize.transform';

export class CreateTeamDto {
    @ApiProperty({
        description: 'Team title',
        example: 'Engineering Team',
        maximum: TEAM_CONSTRAINTS.TITLE.LENGTH.MAX,
        minimum: TEAM_CONSTRAINTS.TITLE.LENGTH.MIN,
        type: 'string',
        required: true,
    })
    @ToOptionalTrimmedString({
        min: TEAM_CONSTRAINTS.TITLE.LENGTH.MIN,
        max: TEAM_CONSTRAINTS.TITLE.LENGTH.MAX,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(TEAM_CONSTRAINTS.TITLE.LENGTH.MIN)
    @MaxLength(TEAM_CONSTRAINTS.TITLE.LENGTH.MAX)
    title!: string;

    @ApiPropertyOptional({
        description: 'Team description',
        example: 'Responsible for product development',
        nullable: true,
        maximum: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
        minimum: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        type: 'string',
        required: false,
    })
    @IsOptional()
    @ToOptionalTrimmedString({
        min: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        max: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @IsString()
    @MinLength(TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
    @MaxLength(TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
    description?: string | null;

    @ApiPropertyOptional({
        description: 'Id of team leader',
        example: 12,
        nullable: true,
        type: 'number',
        required: false,
    })
    @IsOptional()
    @ToOptionalInt({ min: 1 })
    @IsInt()
    headId?: number | null;
}
