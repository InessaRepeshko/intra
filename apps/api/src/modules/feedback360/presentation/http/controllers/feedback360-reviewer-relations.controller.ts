import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
  CreateFeedback360ReviewerRelationInput,
  Feedback360ReviewerRelationsService,
} from '../../../application/feedback360-reviewer-relations.service';
import { Feedback360ReviewerRelation } from '../models/feedback360-reviewer-relation.entity';
import { Feedback360ReviewerRelationHttpMapper } from '../mappers/feedback360-reviewer-relation.http.mapper';
import { CreateFeedback360ReviewerRelationDto } from '../dto/reviewer-relation/create-feedback360-reviewer-relation.dto';
import { GetFeedback360ReviewerRelationsDto } from '../dto/reviewer-relation/get-feedback360-reviewer-relations.dto';
import { Feedback360ReviewerRelationsPageDto } from '../dto/reviewer-relation/feedback360-reviewer-relations-page.dto';

@Controller('feedback360/reviewer-relations')
@ApiTags('Feedback360ReviewerRelations')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: Feedback360ReviewerRelation, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class Feedback360ReviewerRelationsController {
  constructor(private readonly service: Feedback360ReviewerRelationsService) {}

  @Post()
  @SerializeOptions({ type: Feedback360ReviewerRelation, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Create a feedback360 reviewer relation' })
  @ApiBody({ type: CreateFeedback360ReviewerRelationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The relation has been successfully created.',
    type: () => OmitType(Feedback360ReviewerRelation, ['createdAt']),
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
  @ApiOperation({ summary: 'Get reviewer relations (filters + pagination)' })
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
  @ApiOperation({ summary: 'Get reviewer relation by ID' })
  @ApiParam({ required: true, name: 'id', type: 'number', description: 'Relation id', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The relation has been successfully retrieved.',
    type: () => OmitType(Feedback360ReviewerRelation, ['createdAt']),
  })
  @ApiReadErrorResponses()
  async findOne(@Param('id') id: string): Promise<Feedback360ReviewerRelation> {
    const found = await this.service.findOne(+id);
    return Feedback360ReviewerRelationHttpMapper.fromDomain(found);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete reviewer relation by ID' })
  @ApiParam({ required: true, name: 'id', type: 'number', description: 'Relation id', example: 1 })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The relation has been successfully deleted.' })
  @ApiDeletionErrorResponses()
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}


