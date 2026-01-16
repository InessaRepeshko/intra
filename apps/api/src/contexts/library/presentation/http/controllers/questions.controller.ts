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
import { QuestionService } from '../../../application/services/question.service';
import { CreateQuestionDto } from '../dto/questions/create-question.dto';
import { QuestionResponse } from '../models/question.response';
import { QuestionHttpMapper } from '../mappers/question.http.mapper';
import { QuestionQueryDto } from '../dto/questions/question-query.dto';
import { UpdateQuestionDto } from '../dto/questions/update-question.dto';
import { AttachQuestionPositionDto } from '../dto/questions/attach-question-position.dto';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';

@ApiTags('Library / Questions')
@Controller('library/questions')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: QuestionResponse })
export class QuestionsController {
  constructor(private readonly service: QuestionService) { }

  @Post()
  @ApiOperation({ summary: 'Create question' })
  @ApiResponse({ status: HttpStatus.CREATED, type: QuestionResponse })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateQuestionDto): Promise<QuestionResponse> {
    const created = await this.service.create({
      competenceId: dto.competenceId,
      title: dto.title,
      answerType: dto.answerType,
      isForSelfassessment: dto.isForSelfassessment,
      questionStatus: dto.questionStatus,
      positionIds: dto.positionIds,
    });
    return QuestionHttpMapper.toResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'Search questions' })
  @ApiResponse({ status: HttpStatus.OK, type: QuestionResponse, isArray: true })
  @ApiListReadErrorResponses()
  async search(@Query() query: QuestionQueryDto): Promise<QuestionResponse[]> {
    const questions = await this.service.search(query);
    return questions.map(QuestionHttpMapper.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get question by id' })
  @ApiResponse({ status: HttpStatus.OK, type: QuestionResponse })
  @ApiReadErrorResponses()
  async getById(@Param('id') id: string): Promise<QuestionResponse> {
    const question = await this.service.getById(Number(id));
    return QuestionHttpMapper.toResponse(question);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update question' })
  @ApiResponse({ status: HttpStatus.OK, type: QuestionResponse })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateQuestionDto): Promise<QuestionResponse> {
    const updated = await this.service.update(Number(id), dto);
    return QuestionHttpMapper.toResponse(updated);
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
  @ApiResponse({ status: HttpStatus.CREATED, type: QuestionResponse })
  @ApiCreateAndUpdateErrorResponses()
  async attachPosition(
    @Param('id') id: string,
    @Body() dto: AttachQuestionPositionDto,
  ): Promise<QuestionResponse> {
    const updated = await this.service.attachPosition(Number(id), dto.positionId);
    return QuestionHttpMapper.toResponse(updated);
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

