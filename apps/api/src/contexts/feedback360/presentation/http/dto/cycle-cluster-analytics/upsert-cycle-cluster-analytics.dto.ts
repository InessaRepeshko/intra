import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Max, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';
import { CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS } from '@intra/shared-kernel';

export class UpsertCycleClusterAnalyticsDto {
    @ApiProperty({ example: 1, description: 'Cycle ID', type: 'number', required: true   })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    cycleId!: number;

    @ApiProperty({ example: 3, description: 'Cluster ID', type: 'number', required: true })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    clusterId!: number;

    @ApiProperty({ example: 42, description: 'Number of employees in this cluster', type: 'number', minimum: 0, required: true })
    @ToOptionalInt({ min: 0 })
    @IsInt()
    @Min(0)
    employeesCount!: number;

    @ApiProperty({ example: 3.2, description: 'Minimum score', type: 'number', minimum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, maximum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX, required: true })
    @ToOptionalInt({ min: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, max: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    @IsNumber()
    @Min(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    minScore!: number;

    @ApiProperty({ example: 9.8, description: 'Maximum score', type: 'number', minimum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, maximum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX, required: true })
    @ToOptionalInt({ min: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, max: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    @IsNumber()
    @Min(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    maxScore!: number;

    @ApiProperty({ example: 6.5, description: 'Average score', type: 'number', minimum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, maximum: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX, required: true })
    @ToOptionalInt({ min: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN, max: CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    @IsNumber()
    @Min(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CYCLE_CLUSTER_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    averageScore!: number;
}
