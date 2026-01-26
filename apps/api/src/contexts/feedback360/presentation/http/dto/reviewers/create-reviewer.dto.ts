import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { REVIEWER_CONSTRAINTS } from '@intra/shared-kernel';

export class CreateReviewerDto {
  @ApiProperty({ example: 4, description: 'Reviewer id', type: 'number', required: true })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  reviewerId!: number;

  @ApiProperty({ example: 3, description: 'Reviewer position id', type: 'number', required: true })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  positionId!: number;

  @ApiProperty({ example: 'Team Lead', description: 'Reviewer position title', type: 'string', required: true, minLength: REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN, maxLength: REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX })
  @ToOptionalTrimmedString({ min: REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN, max: REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX })
  @IsString()
  @MinLength(REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN)
  @MaxLength(REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX)
  positionTitle!: string;
}
