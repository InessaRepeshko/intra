import { POSITION_CONSTRAINTS, SortDirection } from '@intra/shared-kernel';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import {
    ToOptionalEnum,
    ToOptionalTrimmedString,
} from 'src/common/transforms/query-sanitize.transform';
import { PositionSortField } from '../../../../application/ports/position.repository.port';

export class PositionQueryDto {
    @ApiPropertyOptional({
        description: 'Search by title (contains, case-insensitive)',
        minimum: POSITION_CONSTRAINTS.TITLE.LENGTH.MIN,
        maximum: POSITION_CONSTRAINTS.TITLE.LENGTH.MAX,
        example: 'Senior Backend Engineer',
        type: 'string',
    })
    @IsOptional()
    @ToOptionalTrimmedString({
        min: POSITION_CONSTRAINTS.TITLE.LENGTH.MIN,
        max: POSITION_CONSTRAINTS.TITLE.LENGTH.MAX,
    })
    @IsString()
    @MinLength(POSITION_CONSTRAINTS.TITLE.LENGTH.MIN)
    @MaxLength(POSITION_CONSTRAINTS.TITLE.LENGTH.MAX)
    title?: string;

    @ApiPropertyOptional({
        description: 'Search by description (contains, case-insensitive)',
        minimum: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        maximum: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
        example: 'Backend development, architecture design, code reviews',
        type: 'string',
    })
    @IsOptional()
    @ToOptionalTrimmedString({
        min: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        max: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @IsString()
    @MinLength(POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
    @MaxLength(POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
    description?: string;

    @ApiPropertyOptional({
        description:
            'Search by title or description (contains, case-insensitive)',
        minimum: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        maximum: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
        example: 'Senior',
        type: 'string',
    })
    @IsOptional()
    @ToOptionalTrimmedString({
        min: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        max: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @IsString()
    @MinLength(POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
    @MaxLength(POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
    search?: string;

    @ApiPropertyOptional({
        description: 'Sorting field',
        enum: PositionSortField,
        default: PositionSortField.ID,
        example: PositionSortField.TITLE,
        type: 'string',
    })
    @IsOptional()
    @ToOptionalEnum(PositionSortField)
    @IsEnum(PositionSortField)
    sortBy?: PositionSortField;

    @ApiPropertyOptional({
        description: 'Sorting direction',
        enum: SortDirection,
        default: SortDirection.ASC,
        example: SortDirection.DESC,
        type: 'string',
    })
    @IsOptional()
    @ToOptionalEnum(SortDirection)
    @IsEnum(SortDirection)
    sortDirection?: SortDirection;
}
