import {
    CLUSTER_SCORE_ANALYTICS_CONSTRAINTS,
    ClusterScoreAnalyticsDto,
} from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ClusterScoreAnalyticsResponse implements ClusterScoreAnalyticsDto {
    @ApiProperty({
        example: 1,
        description: 'Cycle cluster analytics id',
        type: 'number',
        required: true,
    })
    @Expose()
    id!: number;

    @ApiProperty({
        example: 1,
        description: 'Cycle ID',
        type: 'number',
        required: true,
    })
    @Expose()
    cycleId!: number;

    @ApiProperty({
        example: 2,
        description: 'Cluster ID',
        type: 'number',
        required: true,
    })
    @Expose()
    clusterId!: number;

    @ApiProperty({
        example: 5,
        description: 'Lower bound',
        type: 'number',
        required: true,
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @Expose()
    lowerBound!: number;

    @ApiProperty({
        example: 5,
        description: 'Upper bound',
        type: 'number',
        required: true,
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @Expose()
    upperBound!: number;

    @ApiProperty({
        example: 8,
        description: 'Number of employees in this cluster',
        type: 'number',
        required: true,
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.EMPLOYEES_COUNT.MIN,
    })
    @Expose()
    employeesCount!: number;

    @ApiProperty({
        example: 2.2,
        description: 'Employee density in this cluster',
        type: 'number',
        required: true,
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.DENSITY.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.DENSITY.MAX,
    })
    @Expose()
    employeeDensity!: number;

    @ApiProperty({
        example: 2.2,
        description: 'Minimum score in this cluster',
        type: 'number',
        required: true,
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @Expose()
    minScore!: number;

    @ApiProperty({
        example: 4.8,
        description: 'Maximum score in this cluster',
        type: 'number',
        required: true,
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @Expose()
    maxScore!: number;

    @ApiProperty({
        example: 4.5,
        description: 'Average score in this cluster',
        type: 'number',
        required: true,
        minimum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    @Expose()
    averageScore!: number;

    @ApiProperty({
        example: '2025-01-01T00:00:00.000Z',
        description: 'Created at',
        type: 'string',
        format: 'date-time',
    })
    @Expose()
    createdAt!: Date;

    @ApiProperty({
        example: '2025-01-01T00:00:00.000Z',
        description: 'Updated at',
        type: 'string',
        format: 'date-time',
    })
    @Expose()
    updatedAt!: Date;
}
