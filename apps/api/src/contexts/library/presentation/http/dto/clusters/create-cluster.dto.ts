import { CLUSTER_CONSTRAINTS } from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';

export class CreateClusterDto {
  @ApiProperty({ description: 'Competence id', example: 2, type: 'number' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  competenceId!: number;

  @ApiProperty({ description: 'Lower bound of the cluster', example: 0, type: 'number', minimum: CLUSTER_CONSTRAINTS.SCORE.MIN, maximum: CLUSTER_CONSTRAINTS.SCORE.MAX })
  @ToOptionalInt({ min: CLUSTER_CONSTRAINTS.SCORE.MIN, max: CLUSTER_CONSTRAINTS.SCORE.MAX })
  @IsInt()
  @Min(CLUSTER_CONSTRAINTS.SCORE.MIN)
  @Max(CLUSTER_CONSTRAINTS.SCORE.MAX)
  lowerBound!: number;

  @ApiProperty({ description: 'Upper bound of the cluster', example: 1, type: 'number', minimum: CLUSTER_CONSTRAINTS.SCORE.MIN, maximum: CLUSTER_CONSTRAINTS.SCORE.MAX })
  @ToOptionalInt({ min: CLUSTER_CONSTRAINTS.SCORE.MIN, max: CLUSTER_CONSTRAINTS.SCORE.MAX })
  @IsInt()
  @Min(CLUSTER_CONSTRAINTS.SCORE.MIN)
  @Max(CLUSTER_CONSTRAINTS.SCORE.MAX)
  upperBound!: number;

  @ApiProperty({ description: 'Title of the cluster level', example: 'Beginner', type: 'string', minimum: CLUSTER_CONSTRAINTS.TITLE.LENGTH.MIN, maximum: CLUSTER_CONSTRAINTS.TITLE.LENGTH.MAX })
  @ToOptionalTrimmedString({ min: CLUSTER_CONSTRAINTS.TITLE.LENGTH.MIN, max: CLUSTER_CONSTRAINTS.TITLE.LENGTH.MAX })
  @IsString()
  @MinLength(CLUSTER_CONSTRAINTS.TITLE.LENGTH.MIN)
  @MaxLength(CLUSTER_CONSTRAINTS.TITLE.LENGTH.MAX)
  title: string;

  @ApiProperty({ description: 'Description of the cluster level', example: 'Initial level of competence development', type: 'string', minimum: CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MIN, maximum: CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MAX })
  @ToOptionalTrimmedString({ min: CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MIN, max: CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MAX })
  @IsString()
  @MinLength(CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
  @MaxLength(CLUSTER_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
  description: string;
}
