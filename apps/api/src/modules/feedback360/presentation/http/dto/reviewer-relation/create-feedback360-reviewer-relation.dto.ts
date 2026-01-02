import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class CreateFeedback360ReviewerRelationDto {
  @ToOptionalInt({ min: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ required: true, type: 'number', description: 'Feedback360 id', example: 1 })
  feedback360Id: number;

  @ToOptionalInt({ min: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ required: true, type: 'number', description: 'Reviewer user id', example: 1 })
  userId: number;
}


