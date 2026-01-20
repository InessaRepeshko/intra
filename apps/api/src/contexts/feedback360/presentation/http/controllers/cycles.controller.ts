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
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { CycleService } from '../../../application/services/cycle.service';
import { CreateCycleDto } from '../dto/cycles/create-cycle.dto';
import { CycleQueryDto } from '../dto/cycles/cycle-query.dto';
import { UpdateCycleDto } from '../dto/cycles/update-cycle.dto';
import { CycleResponse } from '../models/cycle.response';
import { Feedback360HttpMapper } from '../mappers/feedback360.http.mapper';

@ApiTags('Feedback360 / Cycles')
  @Controller('feedback360/cycles')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: CycleResponse })
export class CyclesController {
  constructor(private readonly cycles: CycleService) { }

  @Post()
  @ApiOperation({ summary: 'Create 360-Feedback cycle' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CycleResponse })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateCycleDto): Promise<CycleResponse> {
    const created = await this.cycles.create(dto);
    return Feedback360HttpMapper.toCycleResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'List 360-Feedback cycles' })
  @ApiResponse({ status: HttpStatus.OK, type: CycleResponse, isArray: true })
  @ApiListReadErrorResponses()
  async search(@Query() query: CycleQueryDto): Promise<CycleResponse[]> {
    const items = await this.cycles.search(query);
    return items.map(Feedback360HttpMapper.toCycleResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get 360-Feedback cycle by id' })
  @ApiResponse({ status: HttpStatus.OK, type: CycleResponse })
  @ApiReadErrorResponses()
  async getById(@Param('id') id: string): Promise<CycleResponse> {
    const cycle = await this.cycles.getById(Number(id));
    return Feedback360HttpMapper.toCycleResponse(cycle);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update 360-Feedback cycle' })
  @ApiResponse({ status: HttpStatus.OK, type: CycleResponse })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateCycleDto): Promise<CycleResponse> {
    const updated = await this.cycles.update(Number(id), dto);
    return Feedback360HttpMapper.toCycleResponse(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete 360-Feedback cycle' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async delete(@Param('id') id: string): Promise<void> {
    await this.cycles.delete(Number(id));
  }
}
