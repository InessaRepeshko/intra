import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';
import { CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS } from '@intra/shared-kernel';

export class UpdateCycleClusterAnalyticsDto {
    @ApiPropertyOptional({ example: 45, description: 'Number of employees in this cluster', type: 'number', minimum: 0, required: false })
    @ToOptionalInt({ min: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    employeesCount?: number;

    @ApiPropertyOptional({ example: 3.5, description: 'Minimum score', type: 'number', minimum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, maximum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX, required: false })
    @ToOptionalInt({ min: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, max: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    @IsOptional()
    @IsNumber()
    @Min(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    minScore?: number;

    @ApiPropertyOptional({ example: 9.5, description: 'Maximum score', type: 'number', minimum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, maximum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX, required: false })
    @ToOptionalInt({ min: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, max: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    @IsOptional()
    @IsNumber()
    @Min(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    maxScore?: number;

    @ApiPropertyOptional({ example: 6.8, description: 'Average score', type: 'number', minimum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, maximum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX, required: false })
    @ToOptionalInt({ min: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, max: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    @IsOptional()
    @IsNumber()
    @Min(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    averageScore?: number;
}
