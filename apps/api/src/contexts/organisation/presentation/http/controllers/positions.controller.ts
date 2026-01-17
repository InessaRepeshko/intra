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

@ApiTags('Organisation / Positions')
@Controller('organisation/positions')
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
    const positions = await this.positions.search(query);
    return positions.map(PositionHttpMapper.toResponse);
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

  @Post(':id/subordinates')
  @ApiOperation({ summary: 'Add a subordinate position' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PositionResponse })
  @ApiCreateAndUpdateErrorResponses()
  async linkSubordinate(@Param('id') id: string, @Body() dto: CreatePositionLinkDto): Promise<PositionResponse> {
    await this.hierarchy.link(Number(id), dto.subordinateId);
    const subordinate = await this.positions.getById(dto.subordinateId);
    return PositionHttpMapper.toResponse(subordinate);
  }

  @Delete(':id/subordinates/:subordinateId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a subordinate position' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async unlinkSubordinate(@Param('id') id: string, @Param('subordinateId') subordinateId: string): Promise<void> {
    await this.hierarchy.unlink(Number(id), Number(subordinateId));
  }

  @Get(':id/subordinates')
  @ApiOperation({ summary: 'List subordinate positions' })
  @ApiResponse({ status: HttpStatus.OK, type: [PositionResponse] })
  @ApiListReadErrorResponses()
  async listSubordinates(@Param('id') id: string): Promise<PositionResponse[]> {
    const subordinates = await this.hierarchy.listSubordinates(Number(id));
    return subordinates.map(PositionHttpMapper.toResponse);
  }

  @Get(':id/superiors')
  @ApiOperation({ summary: 'List superior positions' })
  @ApiResponse({ status: HttpStatus.OK, type: [PositionResponse] })
  @ApiListReadErrorResponses()
  async listSuperiors(@Param('id') id: string): Promise<PositionResponse[]> {
    const superiors = await this.hierarchy.listSuperiors(Number(id));
    return superiors.map(PositionHttpMapper.toResponse);
  }
}
