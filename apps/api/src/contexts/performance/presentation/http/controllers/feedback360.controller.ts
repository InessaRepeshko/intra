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
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { Feedback360Service } from '../../../application/services/feedback360.service';
import { CreateFeedbackDto } from '../dto/feedbacks/create-feedback.dto';
import { FeedbackQueryDto } from '../dto/feedbacks/feedback-query.dto';
import { UpdateFeedbackDto } from '../dto/feedbacks/update-feedback.dto';
import { FeedbackResponse } from '../models/feedback.response';
import { PerformanceHttpMapper } from '../mappers/performance.http.mapper';
import { AttachQuestionDto } from '../dto/questions/attach-question.dto';
import { FeedbackQuestionRelationResponse } from '../models/feedback-question-relation.response';
import { CreateAnswerDto } from '../dto/answers/create-answer.dto';
import { FeedbackAnswerResponse } from '../models/feedback-answer.response';
import { AnswerQueryDto } from '../dto/answers/answer-query.dto';
import { CreateRespondentDto } from '../dto/respondents/create-respondent.dto';
import { FeedbackRespondentResponse } from '../models/feedback-respondent.response';
import { UpdateRespondentDto } from '../dto/respondents/update-respondent.dto';
import { CreateReviewerDto } from '../dto/reviewers/create-reviewer.dto';
import { FeedbackReviewerResponse } from '../models/feedback-reviewer.response';
import { RespondentCategory } from '../../../domain/respondent-category.enum';

@ApiTags('Performance / Feedback360')
@Controller('performance/feedbacks')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: FeedbackResponse })
export class Feedback360Controller {
  constructor(private readonly feedbacks: Feedback360Service) { }

  @Post()
  @ApiOperation({ summary: 'Create Feedback360' })
  @ApiResponse({ status: HttpStatus.CREATED, type: FeedbackResponse })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateFeedbackDto): Promise<FeedbackResponse> {
    const created = await this.feedbacks.create(dto);
    return PerformanceHttpMapper.toFeedbackResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'List Feedback360' })
  @ApiResponse({ status: HttpStatus.OK, type: FeedbackResponse, isArray: true })
  @ApiListReadErrorResponses()
  async search(@Query() query: FeedbackQueryDto): Promise<FeedbackResponse[]> {
    const items = await this.feedbacks.search(query);
    return items.map(PerformanceHttpMapper.toFeedbackResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Feedback360 by id' })
  @ApiResponse({ status: HttpStatus.OK, type: FeedbackResponse })
  @ApiReadErrorResponses()
  async getById(@Param('id') id: string): Promise<FeedbackResponse> {
    const feedback = await this.feedbacks.getById(Number(id));
    return PerformanceHttpMapper.toFeedbackResponse(feedback);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Feedback360' })
  @ApiResponse({ status: HttpStatus.OK, type: FeedbackResponse })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateFeedbackDto): Promise<FeedbackResponse> {
    const updated = await this.feedbacks.update(Number(id), dto);
    return PerformanceHttpMapper.toFeedbackResponse(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete Feedback360' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async delete(@Param('id') id: string): Promise<void> {
    await this.feedbacks.delete(Number(id));
  }

  @Post(':id/questions')
  @ApiOperation({ summary: 'Add question from library to Feedback360' })
  @ApiResponse({ status: HttpStatus.CREATED, type: FeedbackQuestionRelationResponse })
  @ApiCreateAndUpdateErrorResponses()
  async attachQuestion(
    @Param('id') id: string,
    @Body() dto: AttachQuestionDto,
  ): Promise<FeedbackQuestionRelationResponse> {
    const relation = await this.feedbacks.attachQuestion({
      feedback360Id: Number(id),
      questionId: dto.questionId,
    });
    return PerformanceHttpMapper.toQuestionRelationResponse(relation);
  }

  @Get(':id/questions')
  @ApiOperation({ summary: 'List questions in Feedback360' })
  @ApiResponse({ status: HttpStatus.OK, type: FeedbackQuestionRelationResponse, isArray: true })
  @ApiListReadErrorResponses()
  async listQuestions(@Param('id') id: string): Promise<FeedbackQuestionRelationResponse[]> {
    const relations = await this.feedbacks.listQuestionRelations(Number(id));
    return relations.map(PerformanceHttpMapper.toQuestionRelationResponse);
  }

  @Delete(':id/questions/:questionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete question from Feedback360' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async detachQuestion(@Param('id') id: string, @Param('questionId') questionId: string): Promise<void> {
    await this.feedbacks.detachQuestion(Number(id), Number(questionId));
  }

  @Post(':id/answers')
  @ApiOperation({ summary: 'Add answer' })
  @ApiResponse({ status: HttpStatus.CREATED, type: FeedbackAnswerResponse })
  @ApiCreateAndUpdateErrorResponses()
  async addAnswer(@Param('id') id: string, @Body() dto: CreateAnswerDto): Promise<FeedbackAnswerResponse> {
    const created = await this.feedbacks.addAnswer({
      feedback360Id: Number(id),
      questionId: dto.questionId,
      feedback360QuestionId: dto.feedback360QuestionId,
      respondentCategory: dto.respondentCategory,
      answerType: dto.answerType,
      numericalValue: dto.numericalValue,
      textValue: dto.textValue,
    });
    return PerformanceHttpMapper.toAnswerResponse(created);
  }

  @Get(':id/answers')
  @ApiOperation({ summary: 'List answers' })
  @ApiResponse({ status: HttpStatus.OK, type: FeedbackAnswerResponse, isArray: true })
  @ApiListReadErrorResponses()
  async listAnswers(@Param('id') id: string, @Query() query: AnswerQueryDto): Promise<FeedbackAnswerResponse[]> {
    const answers = await this.feedbacks.listAnswers(Number(id), query.respondentCategory as RespondentCategory | undefined);
    return answers.map(PerformanceHttpMapper.toAnswerResponse);
  }

  @Post(':id/respondents')
  @ApiOperation({ summary: 'Add respondent' })
  @ApiResponse({ status: HttpStatus.CREATED, type: FeedbackRespondentResponse })
  @ApiCreateAndUpdateErrorResponses()
  async addRespondent(@Param('id') id: string, @Body() dto: CreateRespondentDto): Promise<FeedbackRespondentResponse> {
    const relation = await this.feedbacks.addRespondent({
      feedback360Id: Number(id),
      respondentId: dto.respondentId,
      respondentCategory: dto.respondentCategory,
      feedback360Status: dto.feedback360Status,
      respondentNote: dto.respondentNote,
      invitedAt: dto.invitedAt,
      respondedAt: dto.respondedAt,
    });
    return PerformanceHttpMapper.toRespondentResponse(relation);
  }

  @Get(':id/respondents')
  @ApiOperation({ summary: 'List respondents' })
  @ApiResponse({ status: HttpStatus.OK, type: FeedbackRespondentResponse, isArray: true })
  @ApiListReadErrorResponses()
  async listRespondents(@Param('id') id: string): Promise<FeedbackRespondentResponse[]> {
    const relations = await this.feedbacks.listRespondents({ feedback360Id: Number(id) });
    return relations.map(PerformanceHttpMapper.toRespondentResponse);
  }

  @Patch('respondents/:relationId')
  @ApiOperation({ summary: 'Update respondent status' })
  @ApiResponse({ status: HttpStatus.OK, type: FeedbackRespondentResponse })
  @ApiCreateAndUpdateErrorResponses()
  async updateRespondent(
    @Param('relationId') relationId: string,
    @Body() dto: UpdateRespondentDto,
  ): Promise<FeedbackRespondentResponse> {
    const updated = await this.feedbacks.updateRespondent(Number(relationId), dto);
    return PerformanceHttpMapper.toRespondentResponse(updated);
  }

  @Delete('respondents/:relationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete respondent' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async deleteRespondent(@Param('relationId') relationId: string): Promise<void> {
    await this.feedbacks.removeRespondent(Number(relationId));
  }

  @Post(':id/reviewers')
  @ApiOperation({ summary: 'Add reviewer' })
  @ApiResponse({ status: HttpStatus.CREATED, type: FeedbackReviewerResponse })
  @ApiCreateAndUpdateErrorResponses()
  async addReviewer(@Param('id') id: string, @Body() dto: CreateReviewerDto): Promise<FeedbackReviewerResponse> {
    const created = await this.feedbacks.addReviewer({
      feedback360Id: Number(id),
      userId: dto.userId,
    });
    return PerformanceHttpMapper.toReviewerResponse(created);
  }

  @Get(':id/reviewers')
  @ApiOperation({ summary: 'List reviewers' })
  @ApiResponse({ status: HttpStatus.OK, type: FeedbackReviewerResponse, isArray: true })
  @ApiListReadErrorResponses()
  async listReviewers(@Param('id') id: string): Promise<FeedbackReviewerResponse[]> {
    const reviewers = await this.feedbacks.listReviewers(Number(id));
    return reviewers.map(PerformanceHttpMapper.toReviewerResponse);
  }

  @Delete('reviewers/:relationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete reviewer' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async deleteReviewer(@Param('relationId') relationId: string): Promise<void> {
    await this.feedbacks.removeReviewer(Number(relationId));
  }
}
