import { ApiProperty } from '@nestjs/swagger';
import { ExposeBasic, ExposeSystemic } from 'src/common/serialisation/public.serialisation.decorator';
import { CycleStage } from '../../../domain/enums/cycle-stage.enum';

export class Feedback360Cycle {
  @ApiProperty({ description: 'Cycle id', example: 1 })
  @ExposeBasic()
  id: number;

  @ApiProperty({ description: 'Cycle title', example: 'Q1 2026' })
  @ExposeBasic()
  title: string;

  @ApiProperty({ description: 'Cycle description', example: 'Quarterly review', nullable: true, required: false })
  @ExposeBasic()
  description: string | null;

  @ApiProperty({ description: 'HR user id', example: 1 })
  @ExposeBasic()
  hrId: number;

  @ApiProperty({ description: 'Cycle stage', enum: CycleStage, example: CycleStage.NEW })
  @ExposeBasic()
  stage: CycleStage;

  @ApiProperty({ description: 'Is active', example: true, nullable: true, required: false })
  @ExposeBasic()
  isActive: boolean | null;

  @ApiProperty({ description: 'Start date', example: '2026-01-01T00:00:00.000Z' })
  @ExposeBasic()
  startDate: Date;

  @ApiProperty({ description: 'Review deadline', nullable: true, required: false })
  @ExposeBasic()
  reviewDeadline: Date | null;

  @ApiProperty({ description: 'Approval deadline', nullable: true, required: false })
  @ExposeBasic()
  approvalDeadline: Date | null;

  @ApiProperty({ description: 'Survey deadline', nullable: true, required: false })
  @ExposeBasic()
  surveyDeadline: Date | null;

  @ApiProperty({ description: 'End date', example: '2026-03-31T00:00:00.000Z' })
  @ExposeBasic()
  endDate: Date;

  @ApiProperty({ description: 'Created at', example: '2026-01-01T00:00:00.000Z' })
  @ExposeSystemic()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2026-01-01T00:00:00.000Z' })
  @ExposeSystemic()
  updatedAt: Date;
}


