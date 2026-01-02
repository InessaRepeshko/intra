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
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
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
import { PositionHttpMapper } from '../mappers/position.http.mapper';

@Controller('positions')
@ApiTags('Positions')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: Position, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @SerializeOptions({ type: Position, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Create a new position' })
  @ApiBody({ type: CreatePositionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The position has been successfully created.',
    type: () => OmitType(Position, ['createdAt', 'updatedAt']),
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
  @ApiOperation({ summary: 'Get all positions with filters and pagination' })
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
  async findAll(@Query() query?: GetPositionsDto): Promise<PositionsPageDto> {
    const result = await this.positionsService.search(query);
    const items = result.items.map((p) => PositionHttpMapper.fromDomain(p));
    return { items, count: result.count, total: result.total };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a position by ID' })
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
    type: () => OmitType(Position, ['createdAt', 'updatedAt']),
  })
  @ApiReadErrorResponses()
  async findOne(@Param('id') id: string): Promise<Position> {
    const position = await this.positionsService.findOne(+id);
    return PositionHttpMapper.fromDomain(position);
  }

  @Patch(':id')
  @SerializeOptions({ type: Position, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Update a position by ID' })
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
    type: () => OmitType(Position, ['createdAt', 'updatedAt']),
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
  @ApiOperation({ summary: 'Delete a position by ID' })
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


