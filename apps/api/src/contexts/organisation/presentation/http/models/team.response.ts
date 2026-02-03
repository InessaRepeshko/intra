import { TEAM_CONSTRAINTS, TeamDto } from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TeamResponse implements TeamDto {
    @ApiProperty({ example: 1, type: 'number', description: 'Id of team' })
    @Expose()
    id!: number;

    @ApiProperty({
        example: 'Engineering Team',
        type: 'string',
        description: 'Title of team',
        minimum: TEAM_CONSTRAINTS.TITLE.LENGTH.MIN,
        maximum: TEAM_CONSTRAINTS.TITLE.LENGTH.MAX,
    })
    @Expose()
    title!: string;

    @ApiProperty({
        example: 'Responsible for product development',
        nullable: true,
        type: 'string',
        description: 'Description of team',
        minimum: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        maximum: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @Expose()
    description!: string | null;

    @ApiProperty({
        example: 10,
        nullable: true,
        type: 'number',
        description: 'Id of team leader',
    })
    @Expose()
    headId!: number | null;

    @ApiProperty({
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T10:00:00.000Z',
        description: 'Date of team creation',
    })
    @Expose()
    createdAt!: Date;

    @ApiProperty({
        type: 'string',
        format: 'date-time',
        example: '2024-01-02T10:00:00.000Z',
        description: 'Date of team update',
    })
    @Expose()
    updatedAt!: Date;
}
