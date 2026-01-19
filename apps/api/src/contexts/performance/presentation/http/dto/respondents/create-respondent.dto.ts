import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ToOptionalDate, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { RespondentCategory } from 'src/contexts/performance/domain/respondent-category.enum';
import { Feedback360Status } from 'src/contexts/performance/domain/feedback360-status.enum';

export class CreateRespondentDto {
  @ApiProperty({ example: 7, description: 'Respondent' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  respondentId!: number;

  @ApiProperty({ enum: RespondentCategory, example: RespondentCategory.TEAM })
  @IsEnum(RespondentCategory)
  respondentCategory!: RespondentCategory;

  @ApiPropertyOptional({ enum: Feedback360Status, example: Feedback360Status.PENDING })
  @IsOptional()
  @IsEnum(Feedback360Status)
  feedback360Status?: Feedback360Status;

  @ApiPropertyOptional({ example: 'Ask to respond by Friday' })
  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  respondentNote?: string;

  @ApiPropertyOptional({ type: String, example: '2025-01-05T00:00:00.000Z' })
  @ToOptionalDate()
  @IsOptional()
  invitedAt?: Date;

  @ApiPropertyOptional({ type: String, example: '2025-01-10T00:00:00.000Z' })
  @ToOptionalDate()
  @IsOptional()
  respondedAt?: Date;
}
