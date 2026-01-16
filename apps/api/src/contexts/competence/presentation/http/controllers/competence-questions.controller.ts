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
import { CompetenceQuestionService } from '../../../application/services/competence-question.service';
import { CreateCompetenceQuestionDto } from '../dto/questions/create-competence-question.dto';
import { CompetenceQuestionResponse } from '../models/competence-question.response';
import { CompetenceQuestionHttpMapper } from '../mappers/competence-question.http.mapper';
import { CompetenceQuestionQueryDto } from '../dto/questions/competence-question-query.dto';
import { UpdateCompetenceQuestionDto } from '../dto/questions/update-competence-question.dto';
import { AttachQuestionPositionDto } from '../dto/questions/attach-question-position.dto';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';

@ApiTags('Competence / Questions')
@Controller('competence/questions')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: CompetenceQuestionResponse })
export class CompetenceQuestionsController {
  constructor(private readonly service: CompetenceQuestionService) {}

  @Post()
  @ApiOperation({ summary: 'Create competence question' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CompetenceQuestionResponse })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateCompetenceQuestionDto): Promise<CompetenceQuestionResponse> {
    const created = await this.service.create({
      competenceId: dto.competenceId,
      title: dto.title,
      answerType: dto.answerType,
      isForSelfassessment: dto.isForSelfassessment,
      questionStatus: dto.questionStatus,
      positionIds: dto.positionIds,
    });
    return CompetenceQuestionHttpMapper.toResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'Search competence questions' })
  @ApiResponse({ status: HttpStatus.OK, type: CompetenceQuestionResponse, isArray: true })
  @ApiListReadErrorResponses()
  async search(@Query() query: CompetenceQuestionQueryDto): Promise<CompetenceQuestionResponse[]> {
    const questions = await this.service.search(query);
    return questions.map(CompetenceQuestionHttpMapper.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get question by id' })
  @ApiResponse({ status: HttpStatus.OK, type: CompetenceQuestionResponse })
  @ApiReadErrorResponses()
  async getById(@Param('id') id: string): Promise<CompetenceQuestionResponse> {
    const question = await this.service.getById(Number(id));
    return CompetenceQuestionHttpMapper.toResponse(question);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update competence question' })
  @ApiResponse({ status: HttpStatus.OK, type: CompetenceQuestionResponse })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateCompetenceQuestionDto): Promise<CompetenceQuestionResponse> {
    const updated = await this.service.update(Number(id), dto);
    return CompetenceQuestionHttpMapper.toResponse(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete question' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(Number(id));
  }

  @Post(':id/positions')
  @ApiOperation({ summary: 'Attach question to position' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CompetenceQuestionResponse })
  @ApiCreateAndUpdateErrorResponses()
  async attachPosition(
    @Param('id') id: string,
    @Body() dto: AttachQuestionPositionDto,
  ): Promise<CompetenceQuestionResponse> {
    const updated = await this.service.attachPosition(Number(id), dto.positionId);
    return CompetenceQuestionHttpMapper.toResponse(updated);
  }

  @Delete(':id/positions/:positionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Detach question from position' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async detachPosition(@Param('id') id: string, @Param('positionId') positionId: string): Promise<void> {
    await this.service.detachPosition(Number(id), Number(positionId));
  }

  @Get(':id/positions')
  @ApiOperation({ summary: 'List linked positions for the question' })
  @ApiResponse({ status: HttpStatus.OK, type: Number, isArray: true })
  @ApiListReadErrorResponses()
  async listPositions(@Param('id') id: string): Promise<number[]> {
    return this.service.listPositions(Number(id));
  }
}

