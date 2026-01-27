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
import { QuestionTemplateService } from '../../../application/services/question-template.service';
import { CreateQuestionTemplateDto } from '../dto/question-templates/create-question-template.dto';
import { QuestionTemplateResponse } from '../models/question-template.response';
import { QuestionTemplateHttpMapper } from '../mappers/question-template.http.mapper';
import { QuestionTemplateQueryDto } from '../dto/question-templates/question-template-query.dto';
import { UpdateQuestionTemplateDto } from '../dto/question-templates/update-question-template.dto';
import { AttachPositionQuestionTemplateDto } from '../dto/question-templates/attach-position-question-template.dto';
import { AttachCompetenceQuestionTemplateDto } from '../dto/question-templates/attach-competence-question-template.dto';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';

@ApiTags('Library / Question Templates')
@Controller('library/question-templates')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: QuestionTemplateResponse })
export class QuestionTemplatesController {
  constructor(private readonly service: QuestionTemplateService) { }

  @Post()
  @ApiOperation({ summary: 'Create question template' })
  @ApiBody({ type: CreateQuestionTemplateDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: QuestionTemplateResponse })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateQuestionTemplateDto): Promise<QuestionTemplateResponse> {
    const created = await this.service.create({
      competenceId: dto.competenceId,
      title: dto.title,
      answerType: dto.answerType,
      isForSelfassessment: dto.isForSelfassessment,
      status: dto.status,
      positionIds: dto.positionIds,
    });
    return QuestionTemplateHttpMapper.toResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'Search question templates' })
  @ApiQuery({ type: QuestionTemplateQueryDto })
  @ApiResponse({ status: HttpStatus.OK, type: QuestionTemplateResponse, isArray: true })
  @ApiListReadErrorResponses()
  async search(@Query() query: QuestionTemplateQueryDto): Promise<QuestionTemplateResponse[]> {
    const questions = await this.service.search(query);
    return questions.map(QuestionTemplateHttpMapper.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get question template by id' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiResponse({ status: HttpStatus.OK, type: QuestionTemplateResponse })
  @ApiReadErrorResponses()
  async getById(@Param('id') id: string): Promise<QuestionTemplateResponse> {
    const question = await this.service.getById(Number(id));
    return QuestionTemplateHttpMapper.toResponse(question);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update question template' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBody({ type: UpdateQuestionTemplateDto })
  @ApiResponse({ status: HttpStatus.OK, type: QuestionTemplateResponse })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateQuestionTemplateDto): Promise<QuestionTemplateResponse> {
    const updated = await this.service.update(Number(id), dto);
    return QuestionTemplateHttpMapper.toResponse(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete question template' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(Number(id));
  }

  @Post(':id/positions')
  @ApiOperation({ summary: 'Attach question template to position' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBody({ type: AttachPositionQuestionTemplateDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: QuestionTemplateResponse })
  @ApiCreateAndUpdateErrorResponses()
  async attachPosition(
    @Param('id') id: string,
    @Body() dto: AttachPositionQuestionTemplateDto,
  ): Promise<QuestionTemplateResponse> {
    const updated = await this.service.attachPosition(Number(id), dto.positionId);
    return QuestionTemplateHttpMapper.toResponse(updated);
  }

  @Delete(':id/positions/:positionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Detach question template from position' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiParam({ name: 'positionId', type: 'number', required: true })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async detachPosition(@Param('id') id: string, @Param('positionId') positionId: string): Promise<void> {
    await this.service.detachPosition(Number(id), Number(positionId));
  }

  @Get(':id/positions')
  @ApiOperation({ summary: 'List linked positions for the question template' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiResponse({ status: HttpStatus.OK, type: Number, isArray: true })
  @ApiListReadErrorResponses()
  async listPositions(@Param('id') id: string): Promise<number[]> {
    return this.service.listPositions(Number(id));
  }

  @Post(':id/competences')
  @ApiOperation({ summary: 'Attach question template to competence' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBody({ type: AttachCompetenceQuestionTemplateDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: Number, isArray: true })
  @ApiCreateAndUpdateErrorResponses()
  async attachCompetence(
    @Param('id') id: string,
    @Body() dto: AttachCompetenceQuestionTemplateDto,
  ): Promise<number[]> {
    return this.service.attachCompetence(Number(id), dto.competenceId);
  }

  @Delete(':id/competences/:competenceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Detach question template from competence' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiParam({ name: 'competenceId', type: 'number', required: true })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async detachCompetence(@Param('id') id: string, @Param('competenceId') competenceId: string): Promise<void> {
    await this.service.detachCompetence(Number(id), Number(competenceId));
  }

  @Get(':id/competences')
  @ApiOperation({ summary: 'List linked competences for the question template' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiResponse({ status: HttpStatus.OK, type: Number, isArray: true })
  @ApiListReadErrorResponses()
  async listCompetences(@Param('id') id: string): Promise<number[]> {
    return this.service.listCompetences(Number(id));
  }
}

