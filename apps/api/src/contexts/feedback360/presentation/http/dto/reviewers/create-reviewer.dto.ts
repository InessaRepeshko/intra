import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, MinLength } from 'class-validator';
import { ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';

export class CreateReviewerDto {
  @ApiProperty({ example: 4, description: 'Користувач-рецензент' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  reviewerId!: number;

  @ApiProperty({ example: 3, description: 'Посада рецензента' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  positionId!: number;

  @ApiProperty({ example: 'Team Lead', description: 'Назва посади' })
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(1)
  positionTitle!: string;
}
