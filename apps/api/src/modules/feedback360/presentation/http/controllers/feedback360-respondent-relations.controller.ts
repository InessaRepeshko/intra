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
import {
  CreateFeedback360RespondentRelationInput,
  Feedback360RespondentRelationsService,
  UpdateFeedback360RespondentRelationInput,
} from '../../../application/feedback360-respondent-relations.service';
import { Feedback360RespondentRelation } from '../models/feedback360-respondent-relation.entity';
import { Feedback360RespondentRelationHttpMapper } from '../mappers/feedback360-respondent-relation.http.mapper';
import { CreateFeedback360RespondentRelationDto } from '../dto/respondent-relation/create-feedback360-respondent-relation.dto';
import { UpdateFeedback360RespondentRelationDto } from '../dto/respondent-relation/update-feedback360-respondent-relation.dto';
import { GetFeedback360RespondentRelationsDto } from '../dto/respondent-relation/get-feedback360-respondent-relations.dto';
import { Feedback360RespondentRelationsPageDto } from '../dto/respondent-relation/feedback360-respondent-relations-page.dto';

@Controller('feedback360/respondent-relations')
@ApiTags('Feedback360RespondentRelations')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: Feedback360RespondentRelation, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class Feedback360RespondentRelationsController {
  constructor(private readonly service: Feedback360RespondentRelationsService) {}

  @Post()
  @SerializeOptions({ type: Feedback360RespondentRelation, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Create a feedback360 respondent relation' })
  @ApiBody({ type: CreateFeedback360RespondentRelationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The relation has been successfully created.',
    type: () => OmitType(Feedback360RespondentRelation, ['createdAt', 'updatedAt']),
  })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateFeedback360RespondentRelationDto): Promise<Feedback360RespondentRelation> {
    const input: CreateFeedback360RespondentRelationInput = {
      feedback360Id: dto.feedback360Id,
      respondentId: dto.respondentId,
      respondentCategory: dto.respondentCategory,
      feedback360Status: dto.feedback360Status,
      respondentNote: dto.respondentNote ?? null,
    };
    const created = await this.service.create(input);
    return Feedback360RespondentRelationHttpMapper.fromDomain(created);
  }

  @Get()
  @ApiOperation({ summary: 'Get respondent relations (filters + pagination)' })
  @ApiQuery({
    name: 'query',
    type: GetFeedback360RespondentRelationsDto,
    required: false,
    description: 'Query parameters for filtering and pagination for respondent relations',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved relations',
    type: Feedback360RespondentRelationsPageDto,
  })
  @ApiListReadErrorResponses()
  async findAll(@Query() query?: GetFeedback360RespondentRelationsDto): Promise<Feedback360RespondentRelationsPageDto> {
    const result = await this.service.search(query);
    const items = result.items.map((r) => Feedback360RespondentRelationHttpMapper.fromDomain(r));
    return { items, count: result.count, total: result.total };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get respondent relation by ID' })
  @ApiParam({ required: true, name: 'id', type: 'number', description: 'Relation id', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The relation has been successfully retrieved.',
    type: () => OmitType(Feedback360RespondentRelation, ['createdAt', 'updatedAt']),
  })
  @ApiReadErrorResponses()
  async findOne(@Param('id') id: string): Promise<Feedback360RespondentRelation> {
    const found = await this.service.findOne(+id);
    return Feedback360RespondentRelationHttpMapper.fromDomain(found);
  }

  @Patch(':id')
  @SerializeOptions({ type: Feedback360RespondentRelation, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Update respondent relation by ID' })
  @ApiParam({ required: true, name: 'id', type: 'number', description: 'Relation id', example: 1 })
  @ApiBody({ required: true, type: UpdateFeedback360RespondentRelationDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The relation has been successfully updated.',
    type: () => OmitType(Feedback360RespondentRelation, ['createdAt', 'updatedAt']),
  })
  @ApiCreateAndUpdateErrorResponses()
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFeedback360RespondentRelationDto,
  ): Promise<Feedback360RespondentRelation> {
    const patch: UpdateFeedback360RespondentRelationInput = {
      respondentCategory: dto.respondentCategory,
      feedback360Status: dto.feedback360Status,
      respondentNote: dto.respondentNote,
    };
    const updated = await this.service.update(+id, patch);
    return Feedback360RespondentRelationHttpMapper.fromDomain(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete respondent relation by ID' })
  @ApiParam({ required: true, name: 'id', type: 'number', description: 'Relation id', example: 1 })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The relation has been successfully deleted.' })
  @ApiDeletionErrorResponses()
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}


