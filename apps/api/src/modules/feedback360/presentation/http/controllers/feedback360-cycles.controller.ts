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
import {
  CreateFeedback360CycleInput,
  Feedback360CyclesService,
  UpdateFeedback360CycleInput,
} from '../../../application/feedback360-cycles.service';
import { Feedback360Cycle } from '../models/feedback360-cycle.entity';
import { Feedback360CycleHttpMapper } from '../mappers/feedback360-cycle.http.mapper';
import { CreateFeedback360CycleDto } from '../dto/cycle/create-feedback360-cycle.dto';
import { UpdateFeedback360CycleDto } from '../dto/cycle/update-feedback360-cycle.dto';
import { GetFeedback360CyclesDto } from '../dto/cycle/get-feedback360-cycles.dto';
import { Feedback360CyclesPageDto } from '../dto/cycle/feedback360-cycles-page.dto';

@Controller('feedback360/cycles')
@ApiTags('Feedback360 / Cycles')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: Feedback360Cycle, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class Feedback360CyclesController {
  constructor(private readonly cyclesService: Feedback360CyclesService) {}

  @Post()
  @SerializeOptions({ type: Feedback360Cycle, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({
    operationId: 'createFeedback360Cycle',
    summary: 'Create a new feedback360 cycle',
    description: 'Create a new feedback360 cycle'
  })
  @ApiBody({ type: CreateFeedback360CycleDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The cycle has been successfully created.',
    type: Feedback360Cycle,
  })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateFeedback360CycleDto): Promise<Feedback360Cycle> {
    const input: CreateFeedback360CycleInput = {
      title: dto.title,
      description: dto.description ?? null,
      hrId: dto.hrId,
      stage: dto.stage,
      isActive: dto.isActive ?? null,
      startDate: dto.startDate,
      reviewDeadline: dto.reviewDeadline ?? null,
      approvalDeadline: dto.approvalDeadline ?? null,
      surveyDeadline: dto.surveyDeadline ?? null,
      endDate: dto.endDate,
    };
    const created = await this.cyclesService.create(input);
    return Feedback360CycleHttpMapper.fromDomain(created);
  }

  @Get()
  @ApiOperation({
    operationId: 'getFeedback360Cycles',
    summary: 'Get feedback360 cycles (filters + pagination)',
    description: 'Get feedback360 cycles (filters + pagination)'
  })
  @ApiQuery({
    name: 'query',
    type: GetFeedback360CyclesDto,
    required: false,
    description: 'Query parameters for filtering and pagination for feedback360 cycles',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved cycles',
    type: Feedback360CyclesPageDto,
  })
  @ApiListReadErrorResponses()
  async findAll(@Query() query?: GetFeedback360CyclesDto): Promise<Feedback360CyclesPageDto> {
    const result = await this.cyclesService.search(query);
    const items = result.items.map((c) => Feedback360CycleHttpMapper.fromDomain(c));
    return { items, count: result.count, total: result.total };
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'getFeedback360CycleById',
    summary: 'Get a feedback360 cycle by ID',
    description: 'Get a feedback360 cycle by ID'
  })
  @ApiParam({ required: true, name: 'id', type: 'number', description: 'The cycle ID', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The cycle has been successfully retrieved.',
    type: Feedback360Cycle,
  })
  @ApiReadErrorResponses()
  async findOne(@Param('id') id: string): Promise<Feedback360Cycle> {
    const cycle = await this.cyclesService.findOne(+id);
    return Feedback360CycleHttpMapper.fromDomain(cycle);
  }

  @Patch(':id')
  @SerializeOptions({ type: Feedback360Cycle, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({
    operationId: 'updateFeedback360CycleById',
    summary: 'Update a feedback360 cycle by ID',
    description: 'Update a feedback360 cycle by ID'
  })
  @ApiParam({ required: true, name: 'id', type: 'number', description: 'The cycle ID', example: 1 })
  @ApiBody({ required: true, type: UpdateFeedback360CycleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The cycle has been successfully updated.',
    type: Feedback360Cycle,
  })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateFeedback360CycleDto): Promise<Feedback360Cycle> {
    const patch: UpdateFeedback360CycleInput = {
      title: dto.title,
      description: dto.description,
      hrId: dto.hrId,
      stage: dto.stage,
      isActive: dto.isActive,
      startDate: dto.startDate,
      reviewDeadline: dto.reviewDeadline,
      approvalDeadline: dto.approvalDeadline,
      surveyDeadline: dto.surveyDeadline,
      endDate: dto.endDate,
    };
    const updated = await this.cyclesService.update(+id, patch);
    return Feedback360CycleHttpMapper.fromDomain(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: 'deleteFeedback360CycleById',
    summary: 'Delete a feedback360 cycle by ID',
    description: 'Delete a feedback360 cycle by ID'
  })
  @ApiParam({ required: true, name: 'id', type: 'number', description: 'The cycle ID', example: 1 })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The cycle has been successfully deleted.' })
  @ApiDeletionErrorResponses()
  async remove(@Param('id') id: string): Promise<void> {
    return this.cyclesService.remove(+id);
  }
}


