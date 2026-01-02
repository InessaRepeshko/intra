import { ApiProperty } from '@nestjs/swagger';
import { ExposeBasic, ExposeSystemic } from 'src/common/serialisation/public.serialisation.decorator';

export class Feedback360ReviewerRelation {
  @ApiProperty({ description: 'Relation id', example: 1 })
  @ExposeBasic()
  id: number;

  @ApiProperty({ description: 'Feedback360 id', example: 1 })
  @ExposeBasic()
  feedback360Id: number;

  @ApiProperty({ description: 'Reviewer user id', example: 1 })
  @ExposeBasic()
  userId: number;

  @ApiProperty({ description: 'Created at', example: '2026-01-01T00:00:00.000Z' })
  @ExposeSystemic()
  createdAt: Date;
}


