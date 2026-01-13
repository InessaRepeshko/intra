import { ApiProperty } from '@nestjs/swagger';
import { ExposeBasic, ExposeSystemic } from 'src/common/serialisation/public.serialisation.decorator';

export class Position {
  @ApiProperty({ description: 'The ID of the position', example: 1 })
  @ExposeBasic()
  id: number;

  @ApiProperty({ description: 'The title of the position', example: 'Software Engineer' })
  @ExposeBasic()
  title: string;

  @ApiProperty({
    description: 'The description of the position',
    example: 'Builds and maintains backend services',
    required: false,
    nullable: true,
  })
  @ExposeBasic()
  description: string | null;

  @ApiProperty({ description: 'The created at date of the position', example: '2021-01-01' })
  @ExposeSystemic()
  createdAt: Date;

  @ApiProperty({ description: 'The updated at date of the position', example: '2021-01-01' })
  @ExposeSystemic()
  updatedAt: Date;
}

