import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PositionResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Senior Backend Engineer' })
  @Expose()
  title!: string;

  @ApiProperty({ example: 'Backend development, architecture design, code reviews', nullable: true })
  @Expose()
  description!: string | null;

  @ApiProperty({ type: String, example: '2024-01-01T10:00:00.000Z' })
  @Expose()
  createdAt?: Date;

  @ApiProperty({ type: String, example: '2024-01-02T10:00:00.000Z' })
  @Expose()
  updatedAt?: Date;
}
