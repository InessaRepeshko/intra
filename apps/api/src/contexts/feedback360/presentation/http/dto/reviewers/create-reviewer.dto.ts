import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class CreateReviewerDto {
  @ApiProperty({ example: 4, description: 'User reviewer' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  userId!: number;
}
