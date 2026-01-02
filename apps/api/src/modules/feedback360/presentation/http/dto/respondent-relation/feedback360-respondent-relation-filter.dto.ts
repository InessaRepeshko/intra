import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Feedback360Status } from '../../../../domain/enums/feedback360-status.enum';
import { RespondentCategory } from '../../../../domain/enums/respondent-category.enum';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';

export class Feedback360RespondentRelationFilterDto {
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({ required: false, type: 'number', description: 'Filter by feedback360Id', example: 1 })
  feedback360Id?: number;

  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({ required: false, type: 'number', description: 'Filter by respondentId', example: 1 })
  respondentId?: number;

  @ToOptionalEnum(RespondentCategory)
  @IsOptional()
  @IsEnum(RespondentCategory)
  @ApiProperty({ required: false, enum: RespondentCategory })
  respondentCategory?: RespondentCategory;

  @ToOptionalEnum(Feedback360Status)
  @IsOptional()
  @IsEnum(Feedback360Status)
  @ApiProperty({ required: false, enum: Feedback360Status })
  feedback360Status?: Feedback360Status;

  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, type: 'string', description: 'Search in respondentNote (contains)', example: 'note' })
  search?: string;
}


