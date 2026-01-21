import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { REVIEW_CONSTRAINTS } from '@intra/shared-kernel';
import { ToOptionalDate, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { RespondentCategory } from 'src/contexts/feedback360/domain/enums/respondent-category.enum';
import { ResponseStatus } from 'src/contexts/feedback360/domain/enums/response-status.enum';

export class CreateRespondentDto {
  @ApiProperty({ example: 7, description: 'Respondent' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  respondentId!: number;

  @ApiProperty({ enum: RespondentCategory, example: RespondentCategory.TEAM })
  @IsEnum(RespondentCategory)
  respondentCategory!: RespondentCategory;

  @ApiPropertyOptional({ enum: ResponseStatus, example: ResponseStatus.PENDING })
  @IsOptional()
  @IsEnum(ResponseStatus)
  responseStatus?: ResponseStatus;

  @ApiPropertyOptional({ example: 'Ask to respond by Friday' })
  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @MinLength(REVIEW_CONSTRAINTS.NOTE.LENGTH.MIN)
  @MaxLength(REVIEW_CONSTRAINTS.NOTE.LENGTH.MAX)
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
