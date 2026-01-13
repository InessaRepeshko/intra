import { ApiProperty } from '@nestjs/swagger';
import { ExposeBasic, ExposeSystemic } from 'src/common/serialisation/public.serialisation.decorator';

export class Team {
  @ApiProperty({ description: 'The ID of the team', example: 1 })
  @ExposeBasic()
  id: number;

  @ApiProperty({ description: 'The title of the team', example: 'Engineering' })
  @ExposeBasic()
  title: string;

  @ApiProperty({
    description: 'The description of the team',
    example: 'Product engineering team',
    nullable: true,
    required: false,
  })
  @ExposeBasic()
  description: string | null;

  @ApiProperty({ description: 'The head user ID of the team', example: 1, required: false, nullable: true })
  @ExposeBasic()
  headId: number | null;

  @ApiProperty({ description: 'The created at date of the team', example: '2021-01-01' })
  @ExposeSystemic()
  createdAt: Date;

  @ApiProperty({ description: 'The updated at date of the team', example: '2021-01-01' })
  @ExposeSystemic()
  updatedAt: Date;
}

