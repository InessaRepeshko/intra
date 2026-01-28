import {
    CLUSTER_CONSTRAINTS,
    ClusterSortField,
    SortDirection,
} from '@intra/shared-kernel';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import {
    ToOptionalEnum,
    ToOptionalInt,
    ToOptionalTrimmedString,
} from 'src/common/transforms/query-sanitize.transform';

export class ClusterQueryDto {
    @ApiPropertyOptional({
        description: 'Filter by competence id',
        example: 2,
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    competenceId?: number;

    @ApiPropertyOptional({
        description: 'Filter by lower bound',
        example: 2,
        type: 'number',
        minimum: CLUSTER_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_CONSTRAINTS.SCORE.MAX,
    })
    @ToOptionalInt({
        min: CLUSTER_CONSTRAINTS.SCORE.MIN,
        max: CLUSTER_CONSTRAINTS.SCORE.MAX,
    })
    @IsOptional()
    @IsInt()
    @Min(CLUSTER_CONSTRAINTS.SCORE.MIN)
    @Max(CLUSTER_CONSTRAINTS.SCORE.MAX)
    lowerBound?: number;

    @ApiPropertyOptional({
        description: 'Filter by upper bound',
        example: 2,
        type: 'number',
        minimum: CLUSTER_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_CONSTRAINTS.SCORE.MAX,
    })
    @ToOptionalInt({
        min: CLUSTER_CONSTRAINTS.SCORE.MIN,
        max: CLUSTER_CONSTRAINTS.SCORE.MAX,
    })
    @IsOptional()
    @IsInt()
    @Min(CLUSTER_CONSTRAINTS.SCORE.MIN)
    @Max(CLUSTER_CONSTRAINTS.SCORE.MAX)
    upperBound?: number;

    @ApiPropertyOptional({
        description: 'Filter by title (contains, case-insensitive)',
        example: 'beginer',
        type: 'string',
        minimum: CLUSTER_CONSTRAINTS.TITLE.LENGTH.MIN,
        maximum: CLUSTER_CONSTRAINTS.TITLE.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: CLUSTER_CONSTRAINTS.TITLE.LENGTH.MIN,
        max: CLUSTER_CONSTRAINTS.TITLE.LENGTH.MAX,
    })
    @IsOptional()
    @IsString()
    @MinLength(CLUSTER_CONSTRAINTS.TITLE.LENGTH.MIN)
    @MaxLength(CLUSTER_CONSTRAINTS.TITLE.LENGTH.MAX)
    title?: string;

    @ApiPropertyOptional({
        description: 'Filter by description (contains, case-insensitive)',
        example: 'beginer',
        type: 'string',
        minimum: CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        maximum: CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        max: CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @IsOptional()
    @IsString()
    @MinLength(CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
    @MaxLength(CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
    description?: string;

    @ApiPropertyOptional({
        description:
            'Search by title or description (contains, case-insensitive)',
        example: 'beginer',
        type: 'string',
        minimum: CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        maximum: CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @ToOptionalTrimmedString({
        min: CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        max: CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @IsOptional()
    @IsString()
    @MinLength(CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
    @MaxLength(CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
    search?: string;

    @ApiPropertyOptional({
        enum: ClusterSortField,
        example: ClusterSortField.TITLE,
        type: 'string',
        description: 'Sort by field',
        default: ClusterSortField.ID,
    })
    @ToOptionalEnum(ClusterSortField)
    @IsOptional()
    @IsEnum(ClusterSortField)
    sortBy?: ClusterSortField;

    @ApiPropertyOptional({
        enum: SortDirection,
        example: SortDirection.DESC,
        type: 'string',
        description: 'Sort direction',
        default: SortDirection.ASC,
    })
    @ToOptionalEnum(SortDirection)
    @IsOptional()
    @IsEnum(SortDirection)
    sortDirection?: SortDirection;
}
