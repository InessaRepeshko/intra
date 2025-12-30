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
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTeamInput, TeamsService, UpdateTeamInput } from '../../../application/teams.service';
import { CreateTeamDto } from '../dto/team/create-team.dto';
import { UpdateTeamDto } from '../dto/team/update-team.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { Team } from '../models/team.entity';
import { TeamHttpMapper } from '../mappers/team.http.mapper';
import { PUBLIC_SERIALISATION_GROUPS } from 'src/common/serialisation/public.serialisation.preset';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';

@Controller('teams')
@ApiTags('Teams')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: Team, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @SerializeOptions({ type: Team, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Create a new team' })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The team has been successfully created.',
    type: () => OmitType(Team, ['createdAt', 'updatedAt']),
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
  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The teams have been successfully retrieved.',
    type: () => [OmitType(Team, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findAll(): Promise<Team[]> {
    const teams = await this.teamsService.findAll();
    return teams.map((t) => TeamHttpMapper.fromDomain(t));
  }

  @Get('by-head/:headId')
  @ApiOperation({ summary: 'Get teams by head user ID' })
  @ApiParam({
    required: true,
    name: 'headId',
    type: 'number',
    description: 'The head user ID of the team',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The teams have been successfully retrieved.',
    type: () => [OmitType(Team, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByHeadId(@Param('headId') headId: string): Promise<Team[]> {
    const teams = await this.teamsService.findByHeadId(+headId);
    return teams.map((t) => TeamHttpMapper.fromDomain(t));
  }

  @Get('by-member/:memberId')
  @ApiOperation({ summary: 'Get teams by member user ID' })
  @ApiParam({
    required: true,
    name: 'memberId',
    type: 'number',
    description: 'The member user ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The teams have been successfully retrieved.',
    type: () => [OmitType(Team, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByMemberId(@Param('memberId') memberId: string): Promise<Team[]> {
    const teams = await this.teamsService.findByMemberId(+memberId);
    return teams.map((t) => TeamHttpMapper.fromDomain(t));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a team by ID' })
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
    type: () => OmitType(Team, ['createdAt', 'updatedAt']),
  })
  @ApiReadErrorResponses()
  async findOne(@Param('id') id: string): Promise<Team> {
    const team = await this.teamsService.findOne(+id);
    return TeamHttpMapper.fromDomain(team);
  }

  @Patch(':id')
  @SerializeOptions({ type: Team, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Update a team by ID' })
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
    type: () => OmitType(Team, ['createdAt', 'updatedAt']),
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
  @ApiOperation({ summary: 'Delete a team by ID' })
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
