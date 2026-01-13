import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { ToOptionalBool, ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class AddTeamMemberDto {
  @ApiProperty({ example: 15, description: 'User id' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  userId!: number;

  @ApiPropertyOptional({ example: true, description: 'Is primary membership' })
  @IsOptional()
  @ToOptionalBool()
  @IsBoolean()
  isPrimary?: boolean;
}
