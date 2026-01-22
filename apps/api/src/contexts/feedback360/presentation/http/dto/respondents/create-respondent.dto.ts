import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { REVIEW_CONSTRAINTS } from '@intra/shared-kernel';
import { ToOptionalDate, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { RespondentCategory } from '@intra/shared-kernel';
import { ResponseStatus } from '@intra/shared-kernel';

export class CreateRespondentDto {
  @ApiProperty({ example: 7, description: 'Respondent' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  respondentId!: number;

  @ApiProperty({ enum: RespondentCategory, example: RespondentCategory.TEAM })
  @IsEnum(RespondentCategory)
  category!: RespondentCategory;

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

  @ApiPropertyOptional({ example: 'Коментар HR' })
  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @MinLength(REVIEW_CONSTRAINTS.NOTE.LENGTH.MIN)
  @MaxLength(REVIEW_CONSTRAINTS.NOTE.LENGTH.MAX)
  hrNote?: string;

  @ApiProperty({ example: 3, description: 'Посада респондента' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  positionId!: number;

  @ApiProperty({ example: 'Senior Engineer', description: 'Назва посади' })
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(REVIEW_CONSTRAINTS.NOTE.LENGTH.MIN)
  @MaxLength(REVIEW_CONSTRAINTS.NOTE.LENGTH.MAX)
  positionTitle!: string;

  @ApiPropertyOptional({ type: String, example: '2025-01-05T00:00:00.000Z' })
  @ToOptionalDate()
  @IsOptional()
  invitedAt?: Date;

  @ApiPropertyOptional({ type: String, example: '2025-01-07T00:00:00.000Z' })
  @ToOptionalDate()
  @IsOptional()
  canceledAt?: Date;

  @ApiPropertyOptional({ type: String, example: '2025-01-10T00:00:00.000Z' })
  @ToOptionalDate()
  @IsOptional()
  respondedAt?: Date;
}
