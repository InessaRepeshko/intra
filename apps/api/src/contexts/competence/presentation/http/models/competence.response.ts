import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CompetenceResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiPropertyOptional({ example: 'ENG-001', nullable: true })
  @Expose()
  code!: string | null;

  @ApiProperty({ example: 'Engineering excellence' })
  @Expose()
  title!: string;

  @ApiPropertyOptional({ example: 'Ability to deliver high-quality software', nullable: true })
  @Expose()
  description!: string | null;

  @ApiProperty({ type: String, example: '2024-01-01T10:00:00.000Z' })
  @Expose()
  createdAt?: Date;

  @ApiProperty({ type: String, example: '2024-01-02T10:00:00.000Z' })
  @Expose()
  updatedAt?: Date;
}

