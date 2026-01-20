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
import { ReviewService } from '../../../application/services/review.service';
import { CreateQuestionDto } from '../dto/questions/create-question.dto';
import { QuestionResponse } from '../models/question.response';
import { Feedback360HttpMapper } from '../mappers/feedback360.http.mapper';
import { QuestionQueryDto } from '../dto/questions/question-query.dto';

@ApiTags('Feedback360 / Questions')
@Controller('feedback360/questions')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: QuestionResponse })
export class QuestionsController {
  constructor(private readonly reviews: ReviewService) { }

  @Post()
  @ApiOperation({ summary: 'Create review question' })
  @ApiResponse({ status: HttpStatus.CREATED, type: QuestionResponse })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateQuestionDto): Promise<QuestionResponse> {
    const created = await this.reviews.createReviewQuestion(dto);
    return Feedback360HttpMapper.toQuestionResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'List review questions' })
  @ApiResponse({ status: HttpStatus.OK, type: QuestionResponse, isArray: true })
  @ApiListReadErrorResponses()
  async search(@Query() query: QuestionQueryDto): Promise<QuestionResponse[]> {
    const items = await this.reviews.listReviewQuestions(query);
    return items.map(Feedback360HttpMapper.toQuestionResponse);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete review question' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async delete(@Param('id') id: string): Promise<void> {
    await this.reviews.deleteReviewQuestion(Number(id));
  }
}
