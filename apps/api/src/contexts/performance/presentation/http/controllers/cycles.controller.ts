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
import { Feedback360CycleService } from '../../../application/services/feedback360-cycle.service';
import { CreateCycleDto } from '../dto/cycles/create-cycle.dto';
import { CycleQueryDto } from '../dto/cycles/cycle-query.dto';
import { UpdateCycleDto } from '../dto/cycles/update-cycle.dto';
import { CycleResponse } from '../models/cycle.response';
import { PerformanceHttpMapper } from '../mappers/performance.http.mapper';

@ApiTags('Performance / Cycles')
@Controller('performance/cycles')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: CycleResponse })
export class CyclesController {
  constructor(private readonly cycles: Feedback360CycleService) { }

  @Post()
  @ApiOperation({ summary: 'Create Feedback360 cycle' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CycleResponse })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateCycleDto): Promise<CycleResponse> {
    const created = await this.cycles.create(dto);
    return PerformanceHttpMapper.toCycleResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'List Feedback360 cycles' })
  @ApiResponse({ status: HttpStatus.OK, type: CycleResponse, isArray: true })
  @ApiListReadErrorResponses()
  async search(@Query() query: CycleQueryDto): Promise<CycleResponse[]> {
    const items = await this.cycles.search(query);
    return items.map(PerformanceHttpMapper.toCycleResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Feedback360 cycle by id' })
  @ApiResponse({ status: HttpStatus.OK, type: CycleResponse })
  @ApiReadErrorResponses()
  async getById(@Param('id') id: string): Promise<CycleResponse> {
    const cycle = await this.cycles.getById(Number(id));
    return PerformanceHttpMapper.toCycleResponse(cycle);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Feedback360 cycle' })
  @ApiResponse({ status: HttpStatus.OK, type: CycleResponse })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateCycleDto): Promise<CycleResponse> {
    const updated = await this.cycles.update(Number(id), dto);
    return PerformanceHttpMapper.toCycleResponse(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete Feedback360 cycle' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async delete(@Param('id') id: string): Promise<void> {
    await this.cycles.delete(Number(id));
  }
}
