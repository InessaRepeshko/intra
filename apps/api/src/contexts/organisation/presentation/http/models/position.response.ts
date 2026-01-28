import { POSITION_CONSTRAINTS, PositionDto } from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PositionResponse implements PositionDto {
    @ApiProperty({ example: 1, type: 'number', description: 'Position id' })
    @Expose()
    id!: number;

    @ApiProperty({
        example: 'Senior Backend Engineer',
        type: 'string',
        description: 'Position title',
        minimum: POSITION_CONSTRAINTS.TITLE.LENGTH.MIN,
        maximum: POSITION_CONSTRAINTS.TITLE.LENGTH.MAX,
    })
    @Expose()
    title!: string;

    @ApiProperty({
        example: 'Backend development, architecture design, code reviews',
        nullable: true,
        type: 'string',
        description: 'Position description',
        minimum: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        maximum: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @Expose()
    description!: string | null;

    @ApiProperty({
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T10:00:00.000Z',
        description: 'Position created at',
    })
    @Expose()
    createdAt!: Date;

    @ApiProperty({
        type: 'string',
        format: 'date-time',
        example: '2024-01-02T10:00:00.000Z',
        description: 'Position updated at',
    })
    @Expose()
    updatedAt!: Date;
}
