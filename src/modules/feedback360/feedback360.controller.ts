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
import { Feedback360Service } from './feedback360.service';
import { CreateFeedback360Dto } from './dto/create-feedback360.dto';
import { UpdateFeedback360Dto } from './dto/update-feedback360.dto';
import { Feedback360 } from './entities/feedback360.entity';
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
    return await this.feedback360Service.create(dto);
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
    return await this.feedback360Service.findAll();
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
    return await this.feedback360Service.findByRateeId(+rateeId);
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
    return await this.feedback360Service.findByHrId(+hrId);
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
    return await this.feedback360Service.findByPositionId(+positionId);
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
    return await this.feedback360Service.findByCycleId(+cycleId);
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
    return await this.feedback360Service.findByReportId(+reportId);
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
    type: () => [OmitType(Feedback360, ['createdAt', 'updatedAt'])],
    isArray: true,
  })
  @ApiListReadErrorResponses()
  async findByStage(
    @Param('stage', new ParseEnumPipe(feedback360_stage)) stage: feedback360_stage,
  ): Promise<Feedback360[]> {
    return await this.feedback360Service.findByStage(stage);
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
    return await this.feedback360Service.findOne(+id);
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
    return await this.feedback360Service.update(+id, dto);
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
