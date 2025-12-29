import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { PUBLIC_SERIALISATION_GROUPS } from 'src/common/serialisation/public.serialisation.preset';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { TeamsApplicationService } from '../../application/teams.application-service';
import { CreateTeamHttpDto } from './dto/create-team.http.dto';
import { UpdateTeamHttpDto } from './dto/update-team.http.dto';
import { TeamResponse } from './presenters/team.response';
import { TeamResponseMapper } from './presenters/team-response.mapper';
import { TeamNotFoundError } from '../../domain/errors/team-not-found.error';

@Controller('teams')
@ApiTags('Teams')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: TeamResponse, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class TeamsController {
  constructor(private readonly teams: TeamsApplicationService) {}

  @Post()
  @SerializeOptions({ type: TeamResponse, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Create a new team' })
  @ApiBody({ type: CreateTeamHttpDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The team has been successfully created.',
    type: () => OmitType(TeamResponse, ['createdAt', 'updatedAt']),
  })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateTeamHttpDto): Promise<TeamResponse> {
    const created = await this.teams.create(dto);
    return TeamResponseMapper.toResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The teams have been successfully retrieved.',
    type: () => [OmitType(TeamResponse, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findAll(): Promise<TeamResponse[]> {
    const teams = await this.teams.findAll();
    return teams.map(TeamResponseMapper.toResponse);
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
    type: () => [OmitType(TeamResponse, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByHeadId(@Param('headId') headId: string): Promise<TeamResponse[]> {
    const teams = await this.teams.findByHeadId(+headId);
    return teams.map(TeamResponseMapper.toResponse);
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
    type: () => [OmitType(TeamResponse, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByMemberId(@Param('memberId') memberId: string): Promise<TeamResponse[]> {
    const teams = await this.teams.findByMemberId(+memberId);
    return teams.map(TeamResponseMapper.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a team by ID' })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the team',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The team has been successfully retrieved.',
    type: () => OmitType(TeamResponse, ['createdAt', 'updatedAt']),
  })
  @ApiReadErrorResponses()
  async findOne(@Param('id') id: string): Promise<TeamResponse> {
    try {
      const team = await this.teams.findOne(+id);
      return TeamResponseMapper.toResponse(team);
    } catch (e) {
      if (e instanceof TeamNotFoundError) throw new NotFoundException('Team not found');
      throw e;
    }
  }

  @Patch(':id')
  @SerializeOptions({ type: TeamResponse, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Update a team by ID' })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the team',
    example: 1,
  })
  @ApiBody({
    required: true,
    type: UpdateTeamHttpDto,
    description: 'The team data to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The team has been successfully updated.',
    type: () => OmitType(TeamResponse, ['createdAt', 'updatedAt']),
  })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateTeamHttpDto): Promise<TeamResponse> {
    try {
      const updated = await this.teams.update(+id, dto);
      return TeamResponseMapper.toResponse(updated);
    } catch (e) {
      if (e instanceof TeamNotFoundError) throw new NotFoundException('Team not found');
      throw e;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a team by ID' })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the team',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The team has been successfully deleted.',
  })
  @ApiDeletionErrorResponses()
  async remove(@Param('id') id: string): Promise<void> {
    try {
      return await this.teams.remove(+id);
    } catch (e) {
      if (e instanceof TeamNotFoundError) throw new NotFoundException('Team not found');
      throw e;
    }
  }
}


