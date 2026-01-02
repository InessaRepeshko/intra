import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CycleStage } from '../../../../domain/enums/cycle-stage.enum';
import { ToOptionalBool, ToOptionalDate, ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';

export class Feedback360CycleFilterDto {
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({ required: false, type: 'number', description: 'Filter by hrId', example: 1 })
  hrId?: number;

  @ToOptionalEnum(CycleStage)
  @IsOptional()
  @IsEnum(CycleStage)
  @ApiProperty({ required: false, enum: CycleStage, description: 'Filter by stage' })
  stage?: CycleStage;

  @ToOptionalBool()
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, type: 'boolean', description: 'Filter by isActive', example: true })
  isActive?: boolean;

  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, type: 'string', description: 'Search in title/description (contains)', example: 'Q1' })
  search?: string;

  @ToOptionalDate()
  @IsOptional()
  @IsDate()
  @ApiProperty({ required: false, type: 'string', format: 'date-time', description: 'Filter startDate >= startDateFrom' })
  startDateFrom?: Date;

  @ToOptionalDate()
  @IsOptional()
  @IsDate()
  @ApiProperty({ required: false, type: 'string', format: 'date-time', description: 'Filter startDate <= startDateTo' })
  startDateTo?: Date;
}


