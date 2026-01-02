import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Feedback360Status } from '../../../../domain/enums/feedback360-status.enum';
import { RespondentCategory } from '../../../../domain/enums/respondent-category.enum';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';

export class CreateFeedback360RespondentRelationDto {
  @ToOptionalInt({ min: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ required: true, type: 'number', description: 'Feedback360 id', example: 1 })
  feedback360Id: number;

  @ToOptionalInt({ min: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ required: true, type: 'number', description: 'Respondent user id', example: 1 })
  respondentId: number;

  @ToOptionalEnum(RespondentCategory)
  @IsNotEmpty()
  @IsEnum(RespondentCategory)
  @ApiProperty({ required: true, enum: RespondentCategory })
  respondentCategory: RespondentCategory;

  @ToOptionalEnum(Feedback360Status)
  @IsOptional()
  @IsEnum(Feedback360Status)
  @ApiProperty({ required: false, enum: Feedback360Status, default: Feedback360Status.PENDING })
  feedback360Status?: Feedback360Status;

  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, type: 'string', nullable: true })
  respondentNote?: string | null;
}


