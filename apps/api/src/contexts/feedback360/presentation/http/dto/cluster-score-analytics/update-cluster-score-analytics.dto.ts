import { CLUSTER_SCORE_ANALYTICS_CONSTRAINTS } from '@intra/shared-kernel';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class UpdateClusterScoreAnalyticsDto {
    @ApiPropertyOptional({
        example: 45,
        description: 'Number of employees in this cluster',
        type: 'number',
        minimum: 0,
        required: false,
    })
    @ToOptionalInt({ min: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    employeesCount?: number;

    @ApiPropertyOptional({
        example: 3.5,
        description: 'Employee density',
        type: 'number',
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.DENSITY.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.DENSITY.MAX,
        required: false,
    })
    @ToOptionalInt({
        min: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.DENSITY.MIN,
        max: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.DENSITY.MAX,
    })
    @IsOptional()
    @IsNumber()
    @Min(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.DENSITY.MIN)
    @Max(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.DENSITY.MAX)
    employeeDensity?: number;

    @ApiPropertyOptional({
        example: 3.5,
        description: 'Minimum score',
        type: 'number',
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
        required: false,
    })
    @ToOptionalInt({
        min: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        max: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @IsOptional()
    @IsNumber()
    @Min(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    minScore?: number;

    @ApiPropertyOptional({
        example: 9.5,
        description: 'Maximum score',
        type: 'number',
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
        required: false,
    })
    @ToOptionalInt({
        min: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        max: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @IsOptional()
    @IsNumber()
    @Min(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    maxScore?: number;

    @ApiPropertyOptional({
        example: 6.8,
        description: 'Average score',
        type: 'number',
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
        required: false,
    })
    @ToOptionalInt({
        min: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        max: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @IsOptional()
    @IsNumber()
    @Min(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN)
    @Max(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX)
    averageScore?: number;
}
