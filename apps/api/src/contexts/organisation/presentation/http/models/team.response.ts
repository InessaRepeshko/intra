import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TeamResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Engineering Team' })
  @Expose()
  title!: string;

  @ApiProperty({ example: 'Responsible for product development', nullable: true })
  @Expose()
  description!: string | null;

  @ApiProperty({ example: 10, nullable: true })
  @Expose()
  headId!: number | null;

  @ApiProperty({ type: String, example: '2024-01-01T10:00:00.000Z' })
  @Expose()
  createdAt?: Date;

  @ApiProperty({ type: String, example: '2024-01-02T10:00:00.000Z' })
  @Expose()
  updatedAt?: Date;
}
