import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreatePositionLinkDto {
  @ApiProperty({ example: 5, description: 'Id of child position' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  childId!: number;
}
