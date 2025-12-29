import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamHttpDto } from './create-team.http.dto';

export class UpdateTeamHttpDto extends PartialType(CreateTeamHttpDto) {}


