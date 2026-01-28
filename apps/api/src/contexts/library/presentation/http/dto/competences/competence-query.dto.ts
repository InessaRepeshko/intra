import {
    COMPETENCE_CONSTRAINTS,
    CompetenceSortField,
    SortDirection,
} from '@intra/shared-kernel';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
    ToOptionalEnum,
    ToOptionalTrimmedString,
} from 'src/common/transforms/query-sanitize.transform';

export class CompetenceQueryDto {
    @ApiPropertyOptional({
        description: 'Search by code (contains, case-insensitive)',
        example: 'TECH',
        type: 'string',
        minimum: COMPETENCE_CONSTRAINTS.CODE.LENGTH.MIN,
        maximum: COMPETENCE_CONSTRAINTS.CODE.LENGTH.MAX,
    })
    @IsOptional()
    @ToOptionalTrimmedString()
    @IsString()
    code?: string;

    @ApiPropertyOptional({
        description: 'Search by title (contains, case-insensitive)',
        example: 'tech',
        type: 'string',
        minimum: COMPETENCE_CONSTRAINTS.TITLE.LENGTH.MIN,
        maximum: COMPETENCE_CONSTRAINTS.TITLE.LENGTH.MAX,
    })
    @IsOptional()
    @ToOptionalTrimmedString()
    @IsString()
    title?: string;

    @ApiPropertyOptional({
        description: 'Search by description (contains, case-insensitive)',
        example: 'tech',
        type: 'string',
        minimum: COMPETENCE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        maximum: COMPETENCE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @IsOptional()
    @ToOptionalTrimmedString()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Search by title or code (contains, case-insensitive)',
        example: 'tech',
        type: 'string',
        minimum: COMPETENCE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        maximum: COMPETENCE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @IsOptional()
    @ToOptionalTrimmedString()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        enum: CompetenceSortField,
        example: CompetenceSortField.TITLE,
        description: 'Sort by field',
        type: 'string',
        default: CompetenceSortField.ID,
    })
    @ToOptionalEnum(CompetenceSortField)
    @IsOptional()
    @IsEnum(CompetenceSortField)
    sortBy?: CompetenceSortField;

    @ApiPropertyOptional({
        enum: SortDirection,
        example: SortDirection.ASC,
        description: 'Sort direction',
        type: 'string',
        default: SortDirection.ASC,
    })
    @ToOptionalEnum(SortDirection)
    @IsOptional()
    @IsEnum(SortDirection)
    sortDirection?: SortDirection;
}
