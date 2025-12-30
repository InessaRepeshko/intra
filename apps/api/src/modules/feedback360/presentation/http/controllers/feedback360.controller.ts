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
  ParseEnumPipe,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CreateFeedback360Input, Feedback360Service, UpdateFeedback360Input } from '../../../application/feedback360.service';
import { CreateFeedback360Dto } from '../dto/create-feedback360.dto';
import { UpdateFeedback360Dto } from '../dto/update-feedback360.dto';
import { Feedback360 } from '../models/feedback360.entity';
import { Feedback360HttpMapper } from '../mappers/feedback360.http.mapper';
import { PUBLIC_SERIALISATION_GROUPS } from '../../../../../common/serialisation/public.serialisation.preset';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from '../../../../../common/documentation/api.error.responses.decorator';
import { Feedback360Stage } from '../../../domain/enums/feedback360-stage.enum';

@Controller('feedback360')
@ApiTags('Feedback360')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: Feedback360, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class Feedback360Controller {
  constructor(private readonly feedback360Service: Feedback360Service) {}

  @Post()
  @SerializeOptions({ type: Feedback360, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Create a new feedback360' })
  @ApiBody({ type: CreateFeedback360Dto })
  @ApiResponse({ 
    status: HttpStatus.CREATED,
    description: 'The feedback360 has been successfully created.',
    type: () => OmitType(Feedback360, ['createdAt', 'updatedAt']),
  })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateFeedback360Dto): Promise<Feedback360> {
    const input: CreateFeedback360Input = {
      rateeId: dto.rateeId,
      rateeNote: dto.rateeNote ?? null,
      positionId: dto.positionId,
      hrId: dto.hrId,
      hrNote: dto.hrNote ?? null,
      cycleId: dto.cycleId ?? null,
      stage: dto.stage,
      reportId: dto.reportId ?? null,
    };
    const created = await this.feedback360Service.create(input);
    return Feedback360HttpMapper.fromDomain(created);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedback360' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feedback360 have been successfully retrieved.',
    type: () => [OmitType(Feedback360, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findAll(): Promise<Feedback360[]> {
    const rows = await this.feedback360Service.findAll();
    return rows.map((r) => Feedback360HttpMapper.fromDomain(r));
  }

  @Get('by-ratee/:rateeId')
  @ApiOperation({ summary: 'Get feedback360 by ratee ID' })
  @ApiParam({
    required: true,
    name: 'rateeId',
    type: 'number',
    description: 'The ID of the ratee',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feedback360 have been successfully retrieved.',
    type: () => [OmitType(Feedback360, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByRateeId(@Param('rateeId') rateeId: string): Promise<Feedback360[]> {
    const rows = await this.feedback360Service.findByRateeId(+rateeId);
    return rows.map((r) => Feedback360HttpMapper.fromDomain(r));
  }

  @Get('by-hr/:hrId')
  @ApiOperation({ summary: 'Get feedback360 by HR ID' })
  @ApiParam({
    required: true,
    name: 'hrId',
    type: 'number',
    description: 'The ID of the HR',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feedback360 have been successfully retrieved.',
    type: () => [OmitType(Feedback360, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByHrId(@Param('hrId') hrId: string): Promise<Feedback360[]> {
    const rows = await this.feedback360Service.findByHrId(+hrId);
    return rows.map((r) => Feedback360HttpMapper.fromDomain(r));
  }

  @Get('by-position/:positionId')
  @ApiOperation({ summary: 'Get feedback360 by position ID' })
  @ApiParam({
    required: true,
    name: 'positionId',
    type: 'number',
    description: 'The ID of the position',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feedback360 have been successfully retrieved.',
    type: () => [OmitType(Feedback360, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByPositionId(@Param('positionId') positionId: string): Promise<Feedback360[]> {
    const rows = await this.feedback360Service.findByPositionId(+positionId);
    return rows.map((r) => Feedback360HttpMapper.fromDomain(r));
  }

  @Get('by-cycle/:cycleId')
  @ApiOperation({ summary: 'Get feedback360 by cycle ID' })
  @ApiParam({
    required: true,
    name: 'cycleId',
    type: 'number',
    description: 'The ID of the cycle',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feedback360 have been successfully retrieved.',
    type: () => [OmitType(Feedback360, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByCycleId(@Param('cycleId') cycleId: string): Promise<Feedback360[]> {
    const rows = await this.feedback360Service.findByCycleId(+cycleId);
    return rows.map((r) => Feedback360HttpMapper.fromDomain(r));
  }

  @Get('by-report/:reportId')
  @ApiOperation({ summary: 'Get feedback360 by report ID' })
  @ApiParam({
    required: true,
    name: 'reportId',
    type: 'number',
    description: 'The ID of the report',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feedback360 have been successfully retrieved.',
    type: () => [OmitType(Feedback360, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByReportId(@Param('reportId') reportId: string): Promise<Feedback360[]> {
    const rows = await this.feedback360Service.findByReportId(+reportId);
    return rows.map((r) => Feedback360HttpMapper.fromDomain(r));
  }

  @Get('by-stage/:stage')
  @ApiOperation({ summary: 'Get feedback360 by stage' })
  @ApiParam({
    required: true,
    name: 'stage',
    enum: Feedback360Stage,
    description: 'The stage of the feedback360',
    example: Feedback360Stage.VERIFICATION_BY_HR,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feedback360 have been successfully retrieved.',
    type: () => [OmitType(Feedback360, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByStage(
    @Param('stage', new ParseEnumPipe(Feedback360Stage)) stage: Feedback360Stage,
  ): Promise<Feedback360[]> {
    const rows = await this.feedback360Service.findByStage(stage);
    return rows.map((r) => Feedback360HttpMapper.fromDomain(r));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a feedback360 by ID' })
  @ApiParam({ 
    required: true, 
    name: 'id', 
    type: 'number', 
    description: 'The ID of the feedback360', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feedback360 has been successfully retrieved.',
    type: () => OmitType(Feedback360, ['createdAt', 'updatedAt']),
  })
  @ApiReadErrorResponses()
  async findOne(@Param('id') id: string): Promise<Feedback360> {
    const row = await this.feedback360Service.findOne(+id);
    return Feedback360HttpMapper.fromDomain(row);
  }

  @Patch(':id')
  @SerializeOptions({ type: Feedback360, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Update a feedback360 by ID' })
  @ApiParam({ 
    required: true, 
    name: 'id', 
    type: 'number', 
    description: 'The ID of the feedback360', 
    example: 1 
  })
  @ApiBody({ 
    required: true, 
    type: UpdateFeedback360Dto, 
    description: 'The feedback360 data to update' 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feedback360 has been successfully updated.',
    type: () => OmitType(Feedback360, ['createdAt', 'updatedAt']),
  })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateFeedback360Dto): Promise<Feedback360> {
    const input: UpdateFeedback360Input = {
      rateeNote: dto.rateeNote,
      hrNote: dto.hrNote,
      stage: dto.stage,
    };
    const updated = await this.feedback360Service.update(+id, input);
    return Feedback360HttpMapper.fromDomain(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a feedback360 by ID' })
  @ApiParam({ 
    required: true, 
    name: 'id', 
    type: 'number', 
    description: 'The ID of the feedback360', example: 1 
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The feedback360 has been successfully deleted.',
  })
  @ApiDeletionErrorResponses()
  async remove(@Param('id') id: string): Promise<void> {
    return await this.feedback360Service.remove(+id);
  }
}
