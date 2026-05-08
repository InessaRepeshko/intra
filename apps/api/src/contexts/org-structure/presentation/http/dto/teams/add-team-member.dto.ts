import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { ToOptionalBool, ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class AddTeamMemberDto {
  @ApiProperty({ description: 'User id', example: 15 })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  userId!: number;

  @ApiPropertyOptional({ description: 'Is primary membership', example: true })
  @IsOptional()
  @ToOptionalBool()
  @IsBoolean()
  isPrimary?: boolean;
}
