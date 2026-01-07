import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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
  CreateFeedback360ReviewerRelationInput,
  Feedback360ReviewerRelationsService,
  UpdateFeedback360ReviewerRelationInput,
} from '../../../application/feedback360-reviewer-relations.service';
import { Feedback360ReviewerRelation } from '../models/feedback360-reviewer-relation.entity';
import { Feedback360ReviewerRelationHttpMapper } from '../mappers/feedback360-reviewer-relation.http.mapper';
import { CreateFeedback360ReviewerRelationDto } from '../dto/reviewer-relation/create-feedback360-reviewer-relation.dto';
import { UpdateFeedback360ReviewerRelationDto } from '../dto/reviewer-relation/update-feedback360-reviewer-relation.dto';
import { GetFeedback360ReviewerRelationsDto } from '../dto/reviewer-relation/get-feedback360-reviewer-relations.dto';
import { Feedback360ReviewerRelationsPageDto } from '../dto/reviewer-relation/feedback360-reviewer-relations-page.dto';

@Controller('feedback360/reviewer-relations')
@ApiTags('Feedback360 / Reviewer Relations')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: Feedback360ReviewerRelation, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class Feedback360ReviewerRelationsController {
  constructor(private readonly service: Feedback360ReviewerRelationsService) {}

  @Post()
  @SerializeOptions({ type: Feedback360ReviewerRelation, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({
    operationId: 'createFeedback360ReviewerRelation',
    summary: 'Create a feedback360 reviewer relation',
    description: 'Create a feedback360 reviewer relation'
  })
  @ApiBody({ type: CreateFeedback360ReviewerRelationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The relation has been successfully created.',
    type: Feedback360ReviewerRelation,
  })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateFeedback360ReviewerRelationDto): Promise<Feedback360ReviewerRelation> {
    const input: CreateFeedback360ReviewerRelationInput = {
      feedback360Id: dto.feedback360Id,
      userId: dto.userId,
    };
    const created = await this.service.create(input);
    return Feedback360ReviewerRelationHttpMapper.fromDomain(created);
  }

  @Get()
  @ApiOperation({
    operationId: 'getFeedback360ReviewerRelations',
    summary: 'Get reviewer relations (filters + pagination)',
    description: 'Get reviewer relations (filters + pagination)'
  })
  @ApiQuery({
    name: 'query',
    type: GetFeedback360ReviewerRelationsDto,
    required: false,
    description: 'Query parameters for filtering and pagination for reviewer relations',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved relations',
    type: Feedback360ReviewerRelationsPageDto,
  })
  @ApiListReadErrorResponses()
  async findAll(
    @Query() query?: GetFeedback360ReviewerRelationsDto,
  ): Promise<Feedback360ReviewerRelationsPageDto> {
    const result = await this.service.search(query);
    const items = result.items.map((r) => Feedback360ReviewerRelationHttpMapper.fromDomain(r));
    return { items, count: result.count, total: result.total };
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'getFeedback360ReviewerRelationById',
    summary: 'Get reviewer relation by ID',
    description: 'Get reviewer relation by ID'
  })
  @ApiParam({ required: true, name: 'id', type: 'number', description: 'Relation id', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The relation has been successfully retrieved.',
    type: Feedback360ReviewerRelation,
  })
  @ApiReadErrorResponses()
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Feedback360ReviewerRelation> {
    const found = await this.service.findOne(id);
    return Feedback360ReviewerRelationHttpMapper.fromDomain(found);
  }

  @Patch(':id')
  @SerializeOptions({ type: Feedback360ReviewerRelation, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({
    operationId: 'updateFeedback360ReviewerRelationById',
    summary: 'Update reviewer relation by ID',
    description: 'Update reviewer relation by ID'
  })
  @ApiParam({ required: true, name: 'id', type: 'number', description: 'Relation id', example: 1 })
  @ApiBody({ required: true, type: UpdateFeedback360ReviewerRelationDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The relation has been successfully updated.',
    type: Feedback360ReviewerRelation,
  })
  @ApiCreateAndUpdateErrorResponses()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFeedback360ReviewerRelationDto,
  ): Promise<Feedback360ReviewerRelation> {
    const patch: UpdateFeedback360ReviewerRelationInput = {
      ...(dto.feedback360Id !== undefined ? { feedback360Id: dto.feedback360Id } : {}),
      ...(dto.userId !== undefined ? { userId: dto.userId } : {}),
    };
    const updated = await this.service.update(id, patch);
    return Feedback360ReviewerRelationHttpMapper.fromDomain(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: 'deleteFeedback360ReviewerRelationById',
    summary: 'Delete reviewer relation by ID',
    description: 'Delete reviewer relation by ID'
  })
  @ApiParam({ required: true, name: 'id', type: 'number', description: 'Relation id', example: 1 })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The relation has been successfully deleted.' })
  @ApiDeletionErrorResponses()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}


