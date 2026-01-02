import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Feedback360Stage } from '../../../domain/enums/feedback360-stage.enum';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';

export class Feedback360FilterDto {
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({ required: false, type: 'number', description: 'Filter by rateeId', example: 1 })
  rateeId?: number;

  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({ required: false, type: 'number', description: 'Filter by hrId', example: 1 })
  hrId?: number;

  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({ required: false, type: 'number', description: 'Filter by positionId', example: 1 })
  positionId?: number;

  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({ required: false, type: 'number', description: 'Filter by cycleId', example: 1, nullable: true })
  cycleId?: number;

  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({ required: false, type: 'number', description: 'Filter by reportId', example: 1, nullable: true })
  reportId?: number;

  @ToOptionalEnum(Feedback360Stage)
  @IsOptional()
  @IsEnum(Feedback360Stage)
  @ApiProperty({ required: false, enum: Feedback360Stage, description: 'Filter by stage' })
  stage?: Feedback360Stage;

  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Search in rateeNote/hrNote (contains)',
    example: 'note',
  })
  search?: string;
}


