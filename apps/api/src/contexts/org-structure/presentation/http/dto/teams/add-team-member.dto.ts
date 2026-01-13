import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class AddTeamMemberDto {
  @ApiProperty({ example: 15, description: 'User id' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId!: number;

  @ApiPropertyOptional({ example: true, description: 'Is primary membership' })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
