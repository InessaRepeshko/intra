import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive, IsString, Length } from 'class-validator';
import { TeamConstants } from 'src/common/validators/constants';

export class CreateTeamDto {
  @ApiProperty({
    required: true,
    description: 'The title of the team',
    example: 'Engineering',
    nullable: false,
    type: 'string',
    minLength: TeamConstants.TITLE_MIN_LENGTH,
    maxLength: TeamConstants.TITLE_MAX_LENGTH,
  })
  @IsString()
  @Length(TeamConstants.TITLE_MIN_LENGTH, TeamConstants.TITLE_MAX_LENGTH)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    required: false,
    description: 'The description of the team',
    example: 'Product engineering team',
    nullable: true,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    required: false,
    description: 'The head user ID of the team',
    example: 1,
    nullable: true,
    type: 'number',
  })
  @IsOptional()
  @IsPositive()
  headId?: number | null;
}

