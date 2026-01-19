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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { Feedback360Service } from '../../../application/services/feedback360.service';
import { CreateCycleQuestionDto } from '../dto/questions/create-cycle-question.dto';
import { FeedbackQuestionResponse } from '../models/feedback-question.response';
import { PerformanceHttpMapper } from '../mappers/performance.http.mapper';
import { CycleQuestionQueryDto } from '../dto/questions/cycle-question-query.dto';

@ApiTags('Performance / Cycle Questions')
@Controller('performance/cycle-questions')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: FeedbackQuestionResponse })
export class CycleQuestionsController {
  constructor(private readonly feedbacks: Feedback360Service) { }

  @Post()
  @ApiOperation({ summary: 'Create cycle question' })
  @ApiResponse({ status: HttpStatus.CREATED, type: FeedbackQuestionResponse })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateCycleQuestionDto): Promise<FeedbackQuestionResponse> {
    const created = await this.feedbacks.createCycleQuestion(dto);
    return PerformanceHttpMapper.toFeedbackQuestionResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'List cycle questions' })
  @ApiResponse({ status: HttpStatus.OK, type: FeedbackQuestionResponse, isArray: true })
  @ApiListReadErrorResponses()
  async search(@Query() query: CycleQuestionQueryDto): Promise<FeedbackQuestionResponse[]> {
    const items = await this.feedbacks.listCycleQuestions(query);
    return items.map(PerformanceHttpMapper.toFeedbackQuestionResponse);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete cycle question' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async delete(@Param('id') id: string): Promise<void> {
    await this.feedbacks.deleteCycleQuestion(Number(id));
  }
}
