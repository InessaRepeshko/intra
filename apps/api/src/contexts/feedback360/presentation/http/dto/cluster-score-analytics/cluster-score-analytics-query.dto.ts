import {
    CLUSTER_SCORE_ANALYTICS_CONSTRAINTS,
    ClusterScoreAnalyticsSortField,
    SortDirection,
} from '@intra/shared-kernel';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import {
    ToOptionalEnum,
    ToOptionalInt,
} from 'src/common/transforms/query-sanitize.transform';

export class ClusterScoreAnalyticsQueryDto {
    @ApiPropertyOptional({
        example: 1,
        description: 'Filter by cycle ID',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    cycleId?: number;

    @ApiPropertyOptional({
        example: 3,
        description: 'Filter by cluster ID',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    clusterId?: number;

    @ApiPropertyOptional({
        example: 5,
        description: 'Filter by lower bound',
        type: 'number',
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @ToOptionalInt({
        min: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        max: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @IsOptional()
    @IsInt()
    @Min(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    lowerBound?: number;

    @ApiPropertyOptional({
        example: 5,
        description: 'Filter by upper bound',
        type: 'number',
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @ToOptionalInt({
        min: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        max: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @IsOptional()
    @IsInt()
    @Min(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    upperBound?: number;

    @ApiPropertyOptional({
        example: 10,
        description: 'Filter by employees count',
        type: 'number',
        minimum: 0,
    })
    @ToOptionalInt({ min: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    employeesCount?: number;

    @ApiPropertyOptional({
        example: 5,
        description: 'Filter by min score',
        type: 'number',
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @ToOptionalInt({
        min: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        max: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @IsOptional()
    @IsInt()
    @Min(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    minScore?: number;

    @ApiPropertyOptional({
        example: 5,
        description: 'Filter by max score',
        type: 'number',
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @ToOptionalInt({
        min: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        max: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @IsOptional()
    @IsInt()
    @Min(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    maxScore?: number;

    @ApiPropertyOptional({
        example: 5,
        description: 'Filter by average score',
        type: 'number',
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @ToOptionalInt({
        min: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        max: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @IsOptional()
    @IsInt()
    @Min(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    averageScore?: number;

    @ApiPropertyOptional({
        example: ClusterScoreAnalyticsSortField.AVERAGE_SCORE,
        enum: ClusterScoreAnalyticsSortField,
        description: 'Sort by field',
        type: 'string',
        default: ClusterScoreAnalyticsSortField.ID,
    })
    @ToOptionalEnum(ClusterScoreAnalyticsSortField)
    @IsOptional()
    @IsEnum(ClusterScoreAnalyticsSortField)
    sortBy?: ClusterScoreAnalyticsSortField;

    @ApiPropertyOptional({
        example: SortDirection.DESC,
        enum: SortDirection,
        description: 'Sort direction',
        type: 'string',
        default: SortDirection.ASC,
    })
    @ToOptionalEnum(SortDirection)
    @IsOptional()
    @IsEnum(SortDirection)
    sortDirection?: SortDirection;
}
