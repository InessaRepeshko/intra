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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PositionService } from '../../../application/services/position.service';
import { PositionHierarchyService } from '../../../application/services/position-hierarchy.service';
import { CreatePositionDto } from '../dto/positions/create-position.dto';
import { UpdatePositionDto } from '../dto/positions/update-position.dto';
import { PositionResponse } from '../models/position.response';
import { PositionHttpMapper } from '../mappers/position.http.mapper';
import { PositionQueryDto } from '../dto/positions/position-query.dto';
import { CreatePositionLinkDto } from '../dto/positions/create-position-link.dto';
import { ApiCreateAndUpdateErrorResponses, ApiDeletionErrorResponses, ApiListReadErrorResponses, ApiReadErrorResponses } from 'src/common/documentation/api.error.responses.decorator';

@ApiTags('Org Structure / Positions')
@Controller('org/positions')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: PositionResponse })
export class PositionsController {
  constructor(
    private readonly positions: PositionService,
    private readonly hierarchy: PositionHierarchyService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a position' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PositionResponse })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreatePositionDto): Promise<PositionResponse> {
    const created = await this.positions.create({ title: dto.title, description: dto.description });
    return PositionHttpMapper.toResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'Search positions' })
  @ApiResponse({ status: HttpStatus.OK, type: PositionResponse, isArray: true })
  @ApiListReadErrorResponses()
  async search(@Query() query: PositionQueryDto): Promise<PositionResponse[]> {
    const result = await this.positions.search(query);
    return result.items.map(PositionHttpMapper.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a position by id' })
  @ApiResponse({ status: HttpStatus.OK, type: PositionResponse })
  @ApiReadErrorResponses()
  async getById(@Param('id') id: string): Promise<PositionResponse> {
    const position = await this.positions.getById(Number(id));
    return PositionHttpMapper.toResponse(position);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a position' })
  @ApiResponse({ status: HttpStatus.OK, type: PositionResponse })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdatePositionDto): Promise<PositionResponse> {
    const updated = await this.positions.update(Number(id), dto);
    return PositionHttpMapper.toResponse(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a position' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async delete(@Param('id') id: string): Promise<void> {
    await this.positions.delete(Number(id));
  }

  @Post(':id/children')
  @ApiOperation({ summary: 'Add a child position' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PositionResponse })
  @ApiCreateAndUpdateErrorResponses()
  async linkChild(@Param('id') id: string, @Body() dto: CreatePositionLinkDto): Promise<PositionResponse> {
    await this.hierarchy.link(Number(id), dto.childId);
    const child = await this.positions.getById(dto.childId);
    return PositionHttpMapper.toResponse(child);
  }

  @Delete(':id/children/:childId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a child position' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async unlinkChild(@Param('id') id: string, @Param('childId') childId: string): Promise<void> {
    await this.hierarchy.unlink(Number(id), Number(childId));
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'List child positions' })
  @ApiResponse({ status: HttpStatus.OK, type: [PositionResponse] })
  @ApiListReadErrorResponses()
  async listChildren(@Param('id') id: string): Promise<PositionResponse[]> {
    const children = await this.hierarchy.listChildren(Number(id));
    return children.map(PositionHttpMapper.toResponse);
  }

  @Get(':id/parents')
  @ApiOperation({ summary: 'List parent positions' })
  @ApiResponse({ status: HttpStatus.OK, type: [PositionResponse] })
  @ApiListReadErrorResponses()
  async listParents(@Param('id') id: string): Promise<PositionResponse[]> {
    const parents = await this.hierarchy.listParents(Number(id));
    return parents.map(PositionHttpMapper.toResponse);
  }
}
