import {
    CLUSTER_SCORE_CONSTRAINTS,
    ClusterScoreSortField,
    SortDirection,
} from '@intra/shared-kernel';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import {
    ToOptionalEnum,
    ToOptionalInt,
} from 'src/common/transforms/query-sanitize.transform';

export class ClusterScoreQueryDto {
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
        example: 7,
        description: 'Filter by ratee ID',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    rateeId?: number;

    @ApiPropertyOptional({
        example: 2,
        description: 'Filter by review ID',
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    reviewId?: number;

    @ApiPropertyOptional({
        example: 5,
        description: 'Filter by score',
        type: 'number',
        minimum: CLUSTER_SCORE_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_CONSTRAINTS.SCORE.MAX,
    })
    @ToOptionalInt({
        min: CLUSTER_SCORE_CONSTRAINTS.SCORE.MIN,
        max: CLUSTER_SCORE_CONSTRAINTS.SCORE.MAX,
    })
    @IsOptional()
    @IsInt()
    @Min(CLUSTER_SCORE_CONSTRAINTS.SCORE.MIN)
    @Max(CLUSTER_SCORE_CONSTRAINTS.SCORE.MAX)
    score?: number;

    @ApiPropertyOptional({
        example: 5,
        description: 'Filter by answer count',
        type: 'number',
        minimum: 1,
    })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    answerCount?: number;

    @ApiPropertyOptional({
        example: ClusterScoreSortField.RATEE_ID,
        enum: ClusterScoreSortField,
        description: 'Sort by field',
        type: 'string',
        default: ClusterScoreSortField.ID,
    })
    @ToOptionalEnum(ClusterScoreSortField)
    @IsOptional()
    @IsEnum(ClusterScoreSortField)
    sortBy?: ClusterScoreSortField;

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
