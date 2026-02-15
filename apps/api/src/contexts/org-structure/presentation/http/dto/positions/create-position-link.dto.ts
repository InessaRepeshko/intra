import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class CreatePositionLinkDto {
  @ApiProperty({ description: 'Id of child position', example: 5 })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  childId!: number;
}
