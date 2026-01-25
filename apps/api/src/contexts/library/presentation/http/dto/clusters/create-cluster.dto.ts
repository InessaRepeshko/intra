import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class CreateClusterDto {
  @ApiProperty({ description: 'Competence id', example: 2 })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  competenceId!: number;

  @ApiProperty({ description: 'Lower bound of the cluster', example: 0 })
  @IsNumber()
  lowerBound!: number;

  @ApiProperty({ description: 'Upper bound of the cluster', example: 1 })
  @IsNumber()
  upperBound!: number;

  @ApiProperty({ description: 'Title of the cluster level', example: 'Beginner' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the cluster level', example: 'Initial level of competence development' })
  @IsString()
  description: string;
}
