import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  ParseEnumPipe,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { PUBLIC_SERIALISATION_GROUPS } from 'src/common/serialisation/public.serialisation.preset';
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
} from 'src/common/documentation/api.error.responses.decorator';
import { feedback360_stage } from '@prisma/client';
import { Feedback360ApplicationService } from '../../application/feedback360.application-service';
import { CreateFeedback360HttpDto } from './dto/create-feedback360.http.dto';
import { UpdateFeedback360HttpDto } from './dto/update-feedback360.http.dto';
import { Feedback360Response } from './presenters/feedback360.response';
import { Feedback360ResponseMapper } from './presenters/feedback360-response.mapper';
import { Feedback360NotFoundError } from '../../domain/errors/feedback360-not-found.error';

@Controller('feedback360')
@ApiTags('Feedback360')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: Feedback360Response, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class Feedback360Controller {
  constructor(private readonly feedback: Feedback360ApplicationService) {}

  @Post()
  @SerializeOptions({ type: Feedback360Response, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Create a new feedback360' })
  @ApiBody({ type: CreateFeedback360HttpDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The feedback360 has been successfully created.',
    type: () => OmitType(Feedback360Response, ['createdAt', 'updatedAt']),
  })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateFeedback360HttpDto): Promise<Feedback360Response> {
    const created = await this.feedback.create(dto);
    return Feedback360ResponseMapper.toResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedback360' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feedback360 have been successfully retrieved.',
    type: () => [OmitType(Feedback360Response, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findAll(): Promise<Feedback360Response[]> {
    const items = await this.feedback.findAll();
    return items.map(Feedback360ResponseMapper.toResponse);
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
    type: () => [OmitType(Feedback360Response, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByRateeId(@Param('rateeId') rateeId: string): Promise<Feedback360Response[]> {
    const items = await this.feedback.findByRateeId(+rateeId);
    return items.map(Feedback360ResponseMapper.toResponse);
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
    type: () => [OmitType(Feedback360Response, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByHrId(@Param('hrId') hrId: string): Promise<Feedback360Response[]> {
    const items = await this.feedback.findByHrId(+hrId);
    return items.map(Feedback360ResponseMapper.toResponse);
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
    type: () => [OmitType(Feedback360Response, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByPositionId(@Param('positionId') positionId: string): Promise<Feedback360Response[]> {
    const items = await this.feedback.findByPositionId(+positionId);
    return items.map(Feedback360ResponseMapper.toResponse);
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
    type: () => [OmitType(Feedback360Response, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByCycleId(@Param('cycleId') cycleId: string): Promise<Feedback360Response[]> {
    const items = await this.feedback.findByCycleId(+cycleId);
    return items.map(Feedback360ResponseMapper.toResponse);
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
    type: () => [OmitType(Feedback360Response, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByReportId(@Param('reportId') reportId: string): Promise<Feedback360Response[]> {
    const items = await this.feedback.findByReportId(+reportId);
    return items.map(Feedback360ResponseMapper.toResponse);
  }

  @Get('by-stage/:stage')
  @ApiOperation({ summary: 'Get feedback360 by stage' })
  @ApiParam({
    required: true,
    name: 'stage',
    enum: feedback360_stage,
    description: 'The stage of the feedback360',
    example: feedback360_stage.VERIFICATION_BY_HR,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feedback360 have been successfully retrieved.',
    type: () => [OmitType(Feedback360Response, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByStage(
    @Param('stage', new ParseEnumPipe(feedback360_stage)) stage: feedback360_stage,
  ): Promise<Feedback360Response[]> {
    const items = await this.feedback.findByStage(stage as any);
    return items.map(Feedback360ResponseMapper.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a feedback360 by ID' })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the feedback360',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feedback360 has been successfully retrieved.',
    type: () => OmitType(Feedback360Response, ['createdAt', 'updatedAt']),
  })
  @ApiReadErrorResponses()
  async findOne(@Param('id') id: string): Promise<Feedback360Response> {
    try {
      const found = await this.feedback.findOne(+id);
      return Feedback360ResponseMapper.toResponse(found);
    } catch (e) {
      if (e instanceof Feedback360NotFoundError) throw new NotFoundException('Feedback360 not found');
      throw e;
    }
  }

  @Patch(':id')
  @SerializeOptions({ type: Feedback360Response, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Update a feedback360 by ID' })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the feedback360',
    example: 1,
  })
  @ApiBody({
    required: true,
    type: UpdateFeedback360HttpDto,
    description: 'The feedback360 data to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feedback360 has been successfully updated.',
    type: () => OmitType(Feedback360Response, ['createdAt', 'updatedAt']),
  })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateFeedback360HttpDto): Promise<Feedback360Response> {
    try {
      const updated = await this.feedback.update(+id, dto);
      return Feedback360ResponseMapper.toResponse(updated);
    } catch (e) {
      if (e instanceof Feedback360NotFoundError) throw new NotFoundException('Feedback360 not found');
      throw e;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a feedback360 by ID' })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the feedback360',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The feedback360 has been successfully deleted.',
  })
  @ApiDeletionErrorResponses()
  async remove(@Param('id') id: string): Promise<void> {
    try {
      return await this.feedback.remove(+id);
    } catch (e) {
      if (e instanceof Feedback360NotFoundError) throw new NotFoundException('Feedback360 not found');
      throw e;
    }
  }
}


