import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ToOptionalEnum, ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';
import { CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS, SortDirection, CycleClusterAnalyticsSortField } from '@intra/shared-kernel';

export class CycleClusterAnalyticsQueryDto {
    @ApiPropertyOptional({ example: 1, description: 'Filter by cycle ID', type: 'number' })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    cycleId?: number;

    @ApiPropertyOptional({ example: 3, description: 'Filter by cluster ID', type: 'number' })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    clusterId?: number;

    @ApiPropertyOptional({ example: 10, description: 'Filter by employees count', type: 'number', minimum: 0 })
    @ToOptionalInt({ min: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    employeesCount?: number;

    @ApiPropertyOptional({ example: 5, description: 'Filter by min score', type: 'number', minimum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, maximum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    @ToOptionalInt({ min: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, max: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    @IsOptional()
    @IsInt()
    @Min(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    minScore?: number;

    @ApiPropertyOptional({ example: 5, description: 'Filter by max score', type: 'number', minimum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, maximum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    @ToOptionalInt({ min: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, max: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    @IsOptional()
    @IsInt()
    @Min(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    maxScore?: number;

    @ApiPropertyOptional({ example: 5, description: 'Filter by average score', type: 'number', minimum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, maximum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    @ToOptionalInt({ min: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, max: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    @IsOptional()
    @IsInt()
    @Min(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    averageScore?: number;

    @ApiPropertyOptional({ example: CycleClusterAnalyticsSortField.AVERAGE_SCORE, enum: CycleClusterAnalyticsSortField, description: 'Sort by field', type: 'string', default: CycleClusterAnalyticsSortField.ID })
    @ToOptionalEnum(CycleClusterAnalyticsSortField)
    @IsOptional()
    @IsEnum(CycleClusterAnalyticsSortField)
    sortBy?: CycleClusterAnalyticsSortField;

    @ApiPropertyOptional({ example: SortDirection.DESC, enum: SortDirection, description: 'Sort direction', type: 'string', default: SortDirection.ASC })
    @ToOptionalEnum(SortDirection)
    @IsOptional()
    @IsEnum(SortDirection)
    sortDirection?: SortDirection;
}
