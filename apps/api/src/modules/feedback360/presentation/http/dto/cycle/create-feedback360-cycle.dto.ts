import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Length, IsDate } from 'class-validator';
import { CycleStage } from '../../../../domain/enums/cycle-stage.enum';
import { ToOptionalBool, ToOptionalDate, ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';

export class CreateFeedback360CycleDto {
  @ToOptionalTrimmedString()
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'Cycle title', example: 'Q1 2026' })
  title: string;

  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Cycle description', example: 'Quarterly review', nullable: true })
  description?: string | null;

  @ToOptionalInt({ min: 1 })
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'number', description: 'HR user id', example: 1 })
  hrId: number;

  @ToOptionalEnum(CycleStage)
  @IsOptional()
  @IsEnum(CycleStage)
  @ApiProperty({ required: false, enum: CycleStage, default: CycleStage.NEW })
  stage?: CycleStage;

  @ToOptionalBool()
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, type: 'boolean', default: true, nullable: true })
  isActive?: boolean | null;

  @ToOptionalDate()
  @IsNotEmpty()
  @IsDate()
  @ApiProperty({ required: true, type: 'string', format: 'date-time', description: 'Start date' })
  startDate: Date;

  @ToOptionalDate()
  @IsOptional()
  @IsDate()
  @ApiProperty({ required: false, type: 'string', format: 'date-time', nullable: true })
  reviewDeadline?: Date | null;

  @ToOptionalDate()
  @IsOptional()
  @IsDate()
  @ApiProperty({ required: false, type: 'string', format: 'date-time', nullable: true })
  approvalDeadline?: Date | null;

  @ToOptionalDate()
  @IsOptional()
  @IsDate()
  @ApiProperty({ required: false, type: 'string', format: 'date-time', nullable: true })
  surveyDeadline?: Date | null;

  @ToOptionalDate()
  @IsNotEmpty()
  @IsDate()
  @ApiProperty({ required: true, type: 'string', format: 'date-time', description: 'End date' })
  endDate: Date;
}


