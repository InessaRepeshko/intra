import { ApiProperty } from '@nestjs/swagger';
import { ExposeBasic, ExposeSystemic } from 'src/common/serialisation/public.serialisation.decorator';
import { Feedback360Status } from '../../../domain/enums/feedback360-status.enum';
import { RespondentCategory } from '../../../domain/enums/respondent-category.enum';

export class Feedback360RespondentRelation {
  @ApiProperty({ description: 'Relation id', example: 1 })
  @ExposeBasic()
  id: number;

  @ApiProperty({ description: 'Feedback360 id', example: 1 })
  @ExposeBasic()
  feedback360Id: number;

  @ApiProperty({ description: 'Respondent user id', example: 1 })
  @ExposeBasic()
  respondentId: number;

  @ApiProperty({ description: 'Respondent category', enum: RespondentCategory, example: RespondentCategory.TEAM })
  @ExposeBasic()
  respondentCategory: RespondentCategory;

  @ApiProperty({ description: 'Status', enum: Feedback360Status, example: Feedback360Status.PENDING })
  @ExposeBasic()
  feedback360Status: Feedback360Status;

  @ApiProperty({ description: 'Respondent note', nullable: true, required: false })
  @ExposeBasic()
  respondentNote: string | null;

  @ApiProperty({ description: 'Created at', example: '2026-01-01T00:00:00.000Z' })
  @ExposeSystemic()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2026-01-01T00:00:00.000Z' })
  @ExposeSystemic()
  updatedAt: Date;
}


