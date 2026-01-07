import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpCode,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTeamInput, TeamsService, UpdateTeamInput } from '../../../application/teams.service';
import { CreateTeamDto } from '../dto/team/create-team.dto';
import { UpdateTeamDto } from '../dto/team/update-team.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Team } from '../models/team.entity';
import { TeamWithRelations } from '../models/team-with-relations.entity';
import { TeamHttpMapper } from '../mappers/team.http.mapper';
import { PUBLIC_SERIALISATION_GROUPS } from 'src/common/serialisation/public.serialisation.preset';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { GetTeamsDto } from '../dto/team/get-teams.dto';
import { TeamsPageDto } from '../dto/team/teams-page.dto';

@Controller('teams')
@ApiTags('Teams')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: Team, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) { }

  @Post()
  @SerializeOptions({ type: Team, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ 
    operationId: 'createTeam',
    summary: 'Create a new team',
    description: 'Create a new team with the provided data.'
  })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The team has been successfully created.',
    type: Team,
  })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateTeamDto): Promise<Team> {
    const input: CreateTeamInput = {
      title: dto.title,
      description: dto.description ?? null,
      headId: dto.headId ?? null,
    };
    const created = await this.teamsService.create(input);
    return TeamHttpMapper.fromDomain(created);
  }

  @Get()
  @ApiOperation({ 
    operationId: 'getAllTeams',
    summary: 'Get all teams with filters, sorting and pagination',
    description: 'Get all teams with filters, sorting and pagination for teams'
  })
  @ApiQuery({
    name: 'query',
    type: GetTeamsDto,
    required: false,
    description: 'Query parameters for filtering, sorting and pagination for teams',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved teams',
    type: TeamsPageDto,
  })
  @ApiListReadErrorResponses()
  async findAll(
    @Query() query?: GetTeamsDto
  ): Promise<TeamsPageDto> {
    const result = await this.teamsService.search(query);
    const items = result.items.map((t) => TeamHttpMapper.fromDomain(t));
    return { items, count: result.count, total: result.total };
  }

  @Get(':id')
  @ApiOperation({ 
    operationId: 'getTeamById',
    summary: 'Get a team by ID',
    description: 'Get a team by ID'
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the team',
    example: 1
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The team has been successfully retrieved.',
    type: Team,
  })
  @ApiReadErrorResponses()
  async findOne(@Param('id') id: string): Promise<Team> {
    const team = await this.teamsService.findOne(+id);
    return TeamHttpMapper.fromDomain(team);
  }

  @Get(':id/relations')
  @SerializeOptions({ type: TeamWithRelations, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
  @ApiOperation({ 
    operationId: 'getTeamByIdWithRelations',
    summary: 'Get a team by ID with all relationships',
    description: 'Get a team by ID with all relationships'
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the team',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The team with relationships has been successfully retrieved.',
    type: TeamWithRelations,
  })
  @ApiReadErrorResponses()
  async findOneWithRelations(@Param('id') id: string): Promise<TeamWithRelations> {
    const team = await this.teamsService.findOneWithRelations(+id);
    return TeamHttpMapper.fromDomainWithRelations(team);
  }

  @Patch(':id')
  @SerializeOptions({ type: Team, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ 
    operationId: 'updateTeam',
    summary: 'Update a team by ID',
    description: 'Update a team by ID'
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the team', example: 1
  })
  @ApiBody({
    required: true,
    type: UpdateTeamDto,
    description: 'The team data to update'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The team has been successfully updated.',
    type: Team,
  })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateTeamDto): Promise<Team> {
    const input: UpdateTeamInput = {
      title: dto.title,
      description: dto.description,
      headId: dto.headId,
    };
    const updated = await this.teamsService.update(+id, input);
    return TeamHttpMapper.fromDomain(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    operationId: 'deleteTeam',
    summary: 'Delete a team by ID',
    description: 'Delete a team by ID'
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the team',
    example: 1
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The team has been successfully deleted.'
  })
  @ApiDeletionErrorResponses()
  async remove(@Param('id') id: string): Promise<void> {
    return await this.teamsService.remove(+id);
  }
}
