import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Feedback360Stage } from '../../../domain/enums/feedback360-stage.enum';

export class CreateFeedback360Dto {
  @ApiProperty({
    description: 'The ID of the ratee',
    example: 1,
  })
  @IsPositive()
  rateeId: number;

  @ApiProperty({
    description: 'The note of the ratee',
    example: 'The ratee note',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  rateeNote?: string | null;

  @ApiProperty({
    description: 'The ID of the position',
    example: 1,
  })
  @IsPositive()
  positionId: number;

  @ApiProperty({
    description: 'The ID of the HR',
    example: 1,
  })
  @IsPositive()
  hrId: number;

  @ApiProperty({
    description: 'The note of the HR',
    example: 'The HR note',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  hrNote?: string | null;

  @ApiProperty({
    description: 'The ID of the cycle',
    example: 1,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsPositive()
  cycleId?: number | null;

  @ApiProperty({
    description: 'The stage of the feedback360',
    example: Feedback360Stage.VERIFICATION_BY_HR,
    enum: Feedback360Stage,
    default: Feedback360Stage.VERIFICATION_BY_HR,
    required: false,
  })
  @IsOptional()
  @IsEnum(Feedback360Stage)
  stage?: Feedback360Stage;

  @ApiProperty({
    description: 'The ID of the report',
    example: 1,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsPositive()
  reportId?: number | null;
}
