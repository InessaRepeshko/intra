import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { PositionConstants } from '../../../../../common/validators/constants';

export class CreatePositionDto {
  @ApiProperty({
    required: true,
    description: 'The title of the position',
    example: 'Software Engineer',
    nullable: false,
    type: 'string',
    minLength: PositionConstants.TITLE_MIN_LENGTH,
    maxLength: PositionConstants.TITLE_MAX_LENGTH,
  })
  @IsString()
  @Length(PositionConstants.TITLE_MIN_LENGTH, PositionConstants.TITLE_MAX_LENGTH)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    required: false,
    description: 'The description of the position',
    example: 'Builds and maintains backend services',
    nullable: true,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  description?: string | null;
}


