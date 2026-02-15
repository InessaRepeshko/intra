import {
    CLUSTER_SCORE_CONSTRAINTS,
    ClusterScoreWithRelationsDto,
} from '@intra/shared-kernel';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserResponse } from 'src/contexts/identity/presentation/http/models/user.response';
import { ClusterResponse } from 'src/contexts/library/presentation/http/models/cluster.response';

export class ClusterScoreWithRelationsResponse implements ClusterScoreWithRelationsDto {
    @ApiProperty({
        example: 1,
        description: 'Cluster score id',
        type: 'number',
        required: true,
    })
    @Expose()
    id!: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Cycle id',
        type: 'number',
        required: false,
        nullable: true,
    })
    @Expose()
    cycleId?: number | null;

    @ApiProperty({
        example: 3,
        description: 'Cluster id',
        type: 'number',
        required: true,
    })
    @Expose()
    clusterId!: number;

    @ApiProperty({
        example: 7,
        description: 'Ratee id',
        type: 'number',
        required: true,
    })
    @Expose()
    rateeId!: number;

    @ApiProperty({
        example: 2,
        description: 'Review id',
        type: 'number',
        required: true,
    })
    @Expose()
    reviewId!: number;

    @ApiProperty({
        example: 4.3,
        description: 'Cluster score',
        type: 'number',
        required: true,
        minimum: CLUSTER_SCORE_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_SCORE_CONSTRAINTS.SCORE.MAX,
    })
    @Expose()
    score!: number;

    @ApiProperty({
        example: 5,
        description: 'Number of answers this score is based on',
        type: 'number',
        required: true,
        minimum: CLUSTER_SCORE_CONSTRAINTS.ANSWER_COUNT.MIN,
    })
    @Expose()
    answersCount!: number;

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

    @ApiProperty({
        type: ClusterResponse,
        required: true,
        nullable: false,
        description: 'Library cluster data',
    })
    @Expose()
    cluster!: ClusterResponse;

    @ApiProperty({
        type: UserResponse,
        required: true,
        nullable: false,
        description: 'Ratee data',
    })
    @Expose()
    ratee!: UserResponse;
}
