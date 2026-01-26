import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { RESPONDENT_CONSTRAINTS } from '@intra/shared-kernel';
import { ToOptionalDate, ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { RespondentCategory } from '@intra/shared-kernel';
import { ResponseStatus } from '@intra/shared-kernel';

export class CreateRespondentDto {
  @ApiProperty({ example: 7, description: 'Respondent id', type: 'number', required: true })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  respondentId!: number;

  @ApiProperty({ enum: RespondentCategory, example: RespondentCategory.TEAM, description: 'Respondent category', type: 'string', required: true })
  @ToOptionalEnum(RespondentCategory)
  @IsEnum(RespondentCategory)
  category!: RespondentCategory;

  @ApiPropertyOptional({ enum: ResponseStatus, example: ResponseStatus.PENDING, description: 'Response status', type: 'string', required: false })
  @ToOptionalEnum(ResponseStatus)
  @IsOptional()
  @IsEnum(ResponseStatus)
  responseStatus?: ResponseStatus;

  @ApiPropertyOptional({ example: 'Unable to participate due to hospitalisation', description: 'Respondent note', type: 'string', minLength: RESPONDENT_CONSTRAINTS.RESPONDENT_NOTE.LENGTH.MIN, maxLength: RESPONDENT_CONSTRAINTS.RESPONDENT_NOTE.LENGTH.MAX, required: false })
  @ToOptionalTrimmedString({ min: RESPONDENT_CONSTRAINTS.RESPONDENT_NOTE.LENGTH.MIN, max: RESPONDENT_CONSTRAINTS.RESPONDENT_NOTE.LENGTH.MAX })
  @IsOptional()
  @IsString()
  @MinLength(RESPONDENT_CONSTRAINTS.RESPONDENT_NOTE.LENGTH.MIN)
  @MaxLength(RESPONDENT_CONSTRAINTS.RESPONDENT_NOTE.LENGTH.MAX)
  respondentNote?: string;

  @ApiPropertyOptional({ example: 'Completion of probationary period', description: 'HR note', type: 'string', minLength: RESPONDENT_CONSTRAINTS.HR_NOTE.LENGTH.MIN, maxLength: RESPONDENT_CONSTRAINTS.HR_NOTE.LENGTH.MAX, required: false })
  @ToOptionalTrimmedString({ min: RESPONDENT_CONSTRAINTS.HR_NOTE.LENGTH.MIN, max: RESPONDENT_CONSTRAINTS.HR_NOTE.LENGTH.MAX })
  @IsOptional()
  @IsString()
  @MinLength(RESPONDENT_CONSTRAINTS.HR_NOTE.LENGTH.MIN)
  @MaxLength(RESPONDENT_CONSTRAINTS.HR_NOTE.LENGTH.MAX)
  hrNote?: string;

  @ApiProperty({ example: 3, description: 'Position id', type: 'number', required: true })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  positionId!: number;

  @ApiProperty({ example: 'Senior Engineer', description: 'Position title', type: 'string', minLength: RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN, maxLength: RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX, required: true })
  @ToOptionalTrimmedString({ min: RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN, max: RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX })
  @IsString()
  @MinLength(RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN)
  @MaxLength(RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX)
  positionTitle!: string;

  @ApiPropertyOptional({ example: '2025-01-05T00:00:00.000Z', description: 'Invited at', type: 'string', format: 'date-time', required: false })
  @ToOptionalDate()
  @IsOptional()
  invitedAt?: Date;

  @ApiPropertyOptional({ example: '2025-01-07T00:00:00.000Z', description: 'Canceled at', type: 'string', format: 'date-time', required: false })
  @ToOptionalDate()
  @IsOptional()
  canceledAt?: Date;

  @ApiPropertyOptional({ example: '2025-01-10T00:00:00.000Z', description: 'Responded at', type: 'string', format: 'date-time', required: false })
  @ToOptionalDate()
  @IsOptional()
  respondedAt?: Date;
}
