import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CompetenceResponse {
    @ApiProperty({ example: 1, type: 'number', description: 'Competence id' })
    @Expose()
    id!: number;

    @ApiPropertyOptional({
        example: 'COMM',
        nullable: true,
        type: 'string',
        description: 'Competence code',
    })
    @Expose()
    code!: string | null;

    @ApiProperty({
        example: 'Communication',
        type: 'string',
        description: 'Competence title',
    })
    @Expose()
    title!: string;

    @ApiPropertyOptional({
        example: 'Shares context clearly and adapts message to the audience.',
        nullable: true,
        type: 'string',
        description: 'Competence description',
    })
    @Expose()
    description!: string | null;

    @ApiProperty({
        example: '2024-01-01T10:00:00.000Z',
        type: 'string',
        format: 'date-time',
        description: 'Creation date',
    })
    @Expose()
    createdAt!: Date;

    @ApiProperty({
        example: '2024-01-02T10:00:00.000Z',
        type: 'string',
        format: 'date-time',
        description: 'Update date',
    })
    @Expose()
    updatedAt!: Date;
}
