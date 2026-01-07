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
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PUBLIC_SERIALISATION_GROUPS } from 'src/common/serialisation/public.serialisation.preset';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { CreatePositionInput, PositionsService, UpdatePositionInput } from '../../../application/positions.service';
import { CreatePositionDto } from '../dto/position/create-position.dto';
import { GetPositionsDto } from '../dto/position/get-positions.dto';
import { PositionsPageDto } from '../dto/position/positions-page.dto';
import { UpdatePositionDto } from '../dto/position/update-position.dto';
import { Position } from '../models/position.entity';
import { PositionWithRelations } from '../models/position-with-relations.entity';
import { PositionHttpMapper } from '../mappers/position.http.mapper';

@Controller('positions')
@ApiTags('Positions')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: Position, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) { }

  @Post()
  @SerializeOptions({ type: Position, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ 
    operationId: 'createPosition',
    summary: 'Create a new position',
    description: 'Create a new position with the provided data.'
  })
  @ApiBody({ type: CreatePositionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The position has been successfully created.',
    type: Position,
  })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreatePositionDto): Promise<Position> {
    const input: CreatePositionInput = {
      title: dto.title,
      description: dto.description ?? null,
    };
    const created = await this.positionsService.create(input);
    return PositionHttpMapper.fromDomain(created);
  }

  @Get()
  @ApiOperation({ 
    operationId: 'getAllPositions',
    summary: 'Get all positions with filters, sorting and pagination',
    description: 'Get all positions with filters, sorting and pagination for positions'
  })
  @ApiQuery({
    name: 'query',
    type: GetPositionsDto,
    required: false,
    description: 'Query parameters for filtering and pagination for positions',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved positions',
    type: PositionsPageDto,
  })
  @ApiListReadErrorResponses()
  async findAll(
    @Query() query?: GetPositionsDto
  ): Promise<PositionsPageDto> {
    const result = await this.positionsService.search(query);
    const items = result.items.map((p) => PositionHttpMapper.fromDomain(p));
    return { items, count: result.count, total: result.total };
  }

  @Get(':id')
  @ApiOperation({ 
    operationId: 'getPositionById',
    summary: 'Get a position by ID',
    description: 'Get a position by ID'
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the position',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The position has been successfully retrieved.',
    type: Position,
  })
  @ApiReadErrorResponses()
  async findOne(@Param('id') id: string): Promise<Position> {
    const position = await this.positionsService.findOne(+id);
    return PositionHttpMapper.fromDomain(position);
  }

  @Get(':id/relations')
  @SerializeOptions({ type: PositionWithRelations, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
  @ApiOperation({ 
    operationId: 'getPositionByIdWithRelations',
    summary: 'Get a position by ID with all relationships',
    description: 'Get a position by ID with all relationships'
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the position',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The position with relationships has been successfully retrieved.',
    type: PositionWithRelations,
  })
  @ApiReadErrorResponses()
  async findOneWithRelations(@Param('id') id: string): Promise<PositionWithRelations> {
    const position = await this.positionsService.findOneWithRelations(+id);
    return PositionHttpMapper.fromDomainWithRelations(position);
  }

  @Patch(':id')
  @SerializeOptions({ type: Position, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ 
    operationId: 'updatePosition',
    summary: 'Update a position by ID',
    description: 'Update a position by ID'
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the position',
    example: 1,
  })
  @ApiBody({
    required: true,
    type: UpdatePositionDto,
    description: 'The position data to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The position has been successfully updated.',
    type: Position,
  })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdatePositionDto): Promise<Position> {
    const input: UpdatePositionInput = {
      title: dto.title,
      description: dto.description,
    };
    const updated = await this.positionsService.update(+id, input);
    return PositionHttpMapper.fromDomain(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    operationId: 'deletePosition',
    summary: 'Delete a position by ID',
    description: 'Delete a position by ID'
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the position',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The position has been successfully deleted.',
  })
  @ApiDeletionErrorResponses()
  async remove(@Param('id') id: string): Promise<void> {
    return this.positionsService.remove(+id);
  }
}


