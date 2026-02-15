import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    SerializeOptions,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {
    ApiCreateAndUpdateErrorResponses,
    ApiDeletionErrorResponses,
    ApiListReadErrorResponses,
    ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { TeamService } from '../../../application/services/team.service';
import { AddTeamMemberDto } from '../dto/teams/add-team-member.dto';
import { CreateTeamDto } from '../dto/teams/create-team.dto';
import { TeamQueryDto } from '../dto/teams/team-query.dto';
import { UpdateTeamDto } from '../dto/teams/update-team.dto';
import { TeamMembershipHttpMapper } from '../mappers/team-membership.http.mapper';
import { TeamHttpMapper } from '../mappers/team.http.mapper';
import { TeamMemberResponse } from '../models/team-member.response';
import { TeamResponse } from '../models/team.response';

@ApiTags('Organisation / Teams')
@Controller('organisation/teams')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: TeamResponse })
export class TeamsController {
    constructor(private readonly service: TeamService) {}

    @Post()
    @ApiOperation({ summary: 'Create a team' })
    @ApiBody({ type: CreateTeamDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: TeamResponse })
    @ApiCreateAndUpdateErrorResponses()
    async create(@Body() dto: CreateTeamDto): Promise<TeamResponse> {
        const created = await this.service.create({
            title: dto.title,
            description: dto.description,
            headId: dto.headId,
        });
        return TeamHttpMapper.toResponse(created);
    }

    @Get()
    @ApiOperation({ summary: 'Search teams' })
    @ApiQuery({ type: TeamQueryDto })
    @ApiResponse({ status: HttpStatus.OK, type: TeamResponse, isArray: true })
    @ApiListReadErrorResponses()
    async search(@Query() query: TeamQueryDto): Promise<TeamResponse[]> {
        const teams = await this.service.search(query);
        return teams.map(TeamHttpMapper.toResponse);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a team by id' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of team' })
    @ApiResponse({ status: HttpStatus.OK, type: TeamResponse })
    @ApiReadErrorResponses()
    async getById(@Param('id') id: string): Promise<TeamResponse> {
        const team = await this.service.getById(Number(id));
        return TeamHttpMapper.toResponse(team);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a team' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of team' })
    @ApiBody({ type: UpdateTeamDto })
    @ApiResponse({ status: HttpStatus.OK, type: TeamResponse })
    @ApiCreateAndUpdateErrorResponses()
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateTeamDto,
    ): Promise<TeamResponse> {
        const updated = await this.service.update(Number(id), dto);
        return TeamHttpMapper.toResponse(updated);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a team' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of team' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async delete(@Param('id') id: string): Promise<void> {
        await this.service.delete(Number(id));
    }

    @Post(':id/members')
    @ApiOperation({ summary: 'Add a member to a team' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of team' })
    @ApiBody({ type: AddTeamMemberDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: TeamMemberResponse })
    @ApiCreateAndUpdateErrorResponses()
    async addMember(
        @Param('id') id: string,
        @Body() dto: AddTeamMemberDto,
    ): Promise<TeamMemberResponse> {
        const membership = await this.service.addMember(
            Number(id),
            { memberId: dto.memberId, isPrimary: dto.isPrimary },
            { withUser: true },
        );
        return TeamMembershipHttpMapper.toResponse(membership);
    }

    @Get(':id/members')
    @ApiOperation({ summary: 'Get the team members' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of team' })
    @ApiResponse({ status: HttpStatus.OK, type: [TeamMemberResponse] })
    @ApiListReadErrorResponses()
    async listMembers(@Param('id') id: string): Promise<TeamMemberResponse[]> {
        const members = await this.service.listMembers(Number(id), {
            withUsers: true,
        });
        return members.map(TeamMembershipHttpMapper.toResponse);
    }

    @Delete(':id/members/:memberId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a member from a team' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of team' })
    @ApiParam({ name: 'memberId', type: 'number', description: 'Id of member' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async removeMember(
        @Param('id') id: string,
        @Param('memberId') memberId: string,
    ): Promise<void> {
        await this.service.removeMember(Number(id), Number(memberId));
    }
}
