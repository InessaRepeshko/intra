import { IdentityRole } from '@intra/shared-kernel';
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
    UseGuards,
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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthSessionGuard } from 'src/auth/guards/auth-session.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
    ApiCreateAndUpdateErrorResponses,
    ApiDeletionErrorResponses,
    ApiListReadErrorResponses,
    ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { PositionHierarchyService } from '../../../application/services/position-hierarchy.service';
import { PositionService } from '../../../application/services/position.service';
import { CreatePositionLinkDto } from '../dto/positions/create-position-link.dto';
import { CreatePositionDto } from '../dto/positions/create-position.dto';
import { PositionQueryDto } from '../dto/positions/position-query.dto';
import { UpdatePositionDto } from '../dto/positions/update-position.dto';
import { PositionHttpMapper } from '../mappers/position.http.mapper';
import { PositionResponse } from '../models/position.response';

@ApiTags('Organisation / Positions')
@Controller('organisation/positions')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: PositionResponse })
@UseGuards(AuthSessionGuard, RolesGuard)
@Roles(IdentityRole.ADMIN, IdentityRole.HR)
export class PositionsController {
    constructor(
        private readonly positions: PositionService,
        private readonly hierarchy: PositionHierarchyService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a position' })
    @ApiBody({ type: CreatePositionDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: PositionResponse })
    @ApiCreateAndUpdateErrorResponses()
    async create(@Body() dto: CreatePositionDto): Promise<PositionResponse> {
        const created = await this.positions.create({
            title: dto.title,
            description: dto.description,
        });
        return PositionHttpMapper.toResponse(created);
    }

    @Get()
    @ApiOperation({ summary: 'Search positions' })
    @ApiQuery({ type: PositionQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: PositionResponse,
        isArray: true,
    })
    @ApiListReadErrorResponses()
    async search(
        @Query() query: PositionQueryDto,
    ): Promise<PositionResponse[]> {
        const positions = await this.positions.search(query);
        return positions.map(PositionHttpMapper.toResponse);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a position by id' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of position' })
    @ApiResponse({ status: HttpStatus.OK, type: PositionResponse })
    @ApiReadErrorResponses()
    async getById(@Param('id') id: string): Promise<PositionResponse> {
        const position = await this.positions.getById(Number(id));
        return PositionHttpMapper.toResponse(position);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a position' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of position' })
    @ApiBody({ type: UpdatePositionDto })
    @ApiResponse({ status: HttpStatus.OK, type: PositionResponse })
    @ApiCreateAndUpdateErrorResponses()
    async update(
        @Param('id') id: string,
        @Body() dto: UpdatePositionDto,
    ): Promise<PositionResponse> {
        const updated = await this.positions.update(Number(id), dto);
        return PositionHttpMapper.toResponse(updated);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a position' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of position' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async delete(@Param('id') id: string): Promise<void> {
        await this.positions.delete(Number(id));
    }

    @Post(':id/subordinates')
    @ApiOperation({ summary: 'Add a subordinate position' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of position' })
    @ApiBody({ type: CreatePositionLinkDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: PositionResponse })
    @ApiCreateAndUpdateErrorResponses()
    async linkSubordinate(
        @Param('id') id: string,
        @Body() dto: CreatePositionLinkDto,
    ): Promise<PositionResponse> {
        await this.hierarchy.link(Number(id), dto.subordinateId);
        const subordinate = await this.positions.getById(dto.subordinateId);
        return PositionHttpMapper.toResponse(subordinate);
    }

    @Delete(':id/subordinates/:subordinateId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a subordinate position' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of position' })
    @ApiParam({
        name: 'subordinateId',
        type: 'number',
        description: 'Id of subordinate position',
    })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async unlinkSubordinate(
        @Param('id') id: string,
        @Param('subordinateId') subordinateId: string,
    ): Promise<void> {
        await this.hierarchy.unlink(Number(id), Number(subordinateId));
    }

    @Get(':id/subordinates')
    @ApiOperation({ summary: 'List subordinate positions' })
    @ApiParam({
        name: 'id',
        type: 'number',
        description: 'Id of superior position',
    })
    @ApiResponse({ status: HttpStatus.OK, type: [PositionResponse] })
    @ApiListReadErrorResponses()
    async listSubordinates(
        @Param('id') id: string,
    ): Promise<PositionResponse[]> {
        const subordinates = await this.hierarchy.listSubordinates(Number(id));
        return subordinates.map(PositionHttpMapper.toResponse);
    }

    @Get(':id/superiors')
    @ApiOperation({ summary: 'List superior positions' })
    @ApiParam({
        name: 'id',
        type: 'number',
        description: 'Id of subordinate position',
    })
    @ApiResponse({ status: HttpStatus.OK, type: [PositionResponse] })
    @ApiListReadErrorResponses()
    async listSuperiors(@Param('id') id: string): Promise<PositionResponse[]> {
        const superiors = await this.hierarchy.listSuperiors(Number(id));
        return superiors.map(PositionHttpMapper.toResponse);
    }
}
