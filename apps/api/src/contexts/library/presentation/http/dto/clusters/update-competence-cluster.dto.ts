import { PartialType } from '@nestjs/swagger';
import { CreateCompetenceClusterDto } from './create-competence-cluster.dto';

export class UpdateCompetenceClusterDto extends PartialType(CreateCompetenceClusterDto) {}

