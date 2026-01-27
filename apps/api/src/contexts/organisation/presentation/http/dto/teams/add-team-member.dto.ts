import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { ToOptionalBool, ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class AddTeamMemberDto {
  @ApiProperty({ description: 'Member id', example: 15, type: 'number', required: true })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  memberId!: number;

  @ApiPropertyOptional({ description: 'Is primary membership', example: true, type: 'boolean', required: false })
  @IsOptional()
  @ToOptionalBool()
  @IsBoolean()
  isPrimary?: boolean;
}
