import { CLUSTER_CONSTRAINTS, ClusterDto } from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ClusterResponse implements ClusterDto {
    @ApiProperty({ example: 1, description: 'Cluster id', type: 'number' })
    @Expose()
    id!: number;

    @ApiProperty({ example: 2, description: 'Competence id', type: 'number' })
    @Expose()
    competenceId!: number;

    @ApiProperty({
        example: 0,
        description: 'Lower bound of the cluster',
        type: 'number',
        minimum: CLUSTER_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_CONSTRAINTS.SCORE.MAX,
    })
    @Expose()
    lowerBound!: number;

    @ApiProperty({
        example: 1,
        description: 'Upper bound of the cluster',
        type: 'number',
        minimum: CLUSTER_CONSTRAINTS.SCORE.MIN,
        maximum: CLUSTER_CONSTRAINTS.SCORE.MAX,
    })
    @Expose()
    upperBound!: number;

    @ApiProperty({
        example: 'Beginner',
        description: 'Title of the cluster level',
        type: 'string',
        minimum: CLUSTER_CONSTRAINTS.TITLE.LENGTH.MIN,
        maximum: CLUSTER_CONSTRAINTS.TITLE.LENGTH.MAX,
    })
    @Expose()
    title!: string;

    @ApiProperty({
        example: 'Initial level of competence development',
        description: 'Description of the cluster level',
        type: 'string',
        minimum: CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        maximum: CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @Expose()
    description!: string;

    @ApiProperty({
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T10:00:00.000Z',
        description: 'Creation date of the cluster',
    })
    @Expose()
    createdAt!: Date;

    @ApiProperty({
        type: 'string',
        format: 'date-time',
        example: '2024-01-02T10:00:00.000Z',
        description: 'Last update date of the cluster',
    })
    @Expose()
    updatedAt!: Date;
}
