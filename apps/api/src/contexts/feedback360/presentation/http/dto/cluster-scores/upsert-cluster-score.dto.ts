import { CLUSTER_SCORE_CONSTRAINTS } from '@intra/shared-kernel';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class UpsertClusterScoreDto {
    @ApiPropertyOptional({
        example: 1,
        description: 'Cycle id',
        type: 'number',
        required: false,
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    cycleId?: number;

    @ApiProperty({
        example: 3,
        description: 'Cluster id',
        type: 'number',
        required: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    clusterId!: number;

    @ApiProperty({
        example: 7,
        description: 'Ratee id',
        type: 'number',
        required: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    rateeId!: number;

    @ApiProperty({
        example: 5,
        description: 'Review id',
        type: 'number',
        required: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    reviewId!: number;

    @ApiProperty({
        example: 4.5,
        description: 'Score',
        type: 'number',
        minimum: CLUSTER_SCORE_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_CONSTRAINTS.SCORE.MAX,
        required: true,
    })
    @ToOptionalInt({
        min: CLUSTER_SCORE_CONSTRAINTS.SCORE.MIN,
        max: CLUSTER_SCORE_CONSTRAINTS.SCORE.MAX,
    })
    @IsNumber()
    @Min(CLUSTER_SCORE_CONSTRAINTS.SCORE.MIN)
    @Max(CLUSTER_SCORE_CONSTRAINTS.SCORE.MAX)
    score!: number;

    @ApiPropertyOptional({
        example: 5,
        description: 'Number of answers',
        type: 'number',
        minimum: 1,
        required: false,
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    answersCount?: number;
}
