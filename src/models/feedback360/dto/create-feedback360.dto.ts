import { IsDate, IsEnum, IsPositive, IsString } from "class-validator";
import { Feedback360 } from "../entities/feedback360.entity";
import { ApiProperty } from "@nestjs/swagger";
import { feedback360_stage } from "@prisma/client";

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
  })
  @IsString()
  rateeNote: string;

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
  })
  @IsString()
  hrNote: string;

  @ApiProperty({
    description: 'The ID of the cycle',
    example: 1,
  })
  @IsPositive()
  cycleId: number;

  @ApiProperty({
    description: 'The stage of the feedback360',
    example: feedback360_stage.VERIFICATION_BY_HR,
    enum: feedback360_stage,
    default: feedback360_stage.VERIFICATION_BY_HR,
  })
  @IsEnum(feedback360_stage)
  stage: feedback360_stage;

  @ApiProperty({
    description: 'The ID of the report',
    example: 1,
  })
  @IsPositive()
  reportId: number;
}
