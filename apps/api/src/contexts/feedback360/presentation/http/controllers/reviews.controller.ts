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
import { ReviewService } from '../../../application/services/review.service';
import { CreateReviewDto } from '../dto/reviews/create-review.dto';
import { ReviewQueryDto } from '../dto/reviews/review-query.dto';
import { UpdateReviewDto } from '../dto/reviews/update-review.dto';
import { ReviewResponse } from '../models/review.response';
import { Feedback360HttpMapper } from '../mappers/feedback360.http.mapper';
import { AttachQuestionDto } from '../dto/questions/attach-question.dto';
import { ReviewQuestionRelationResponse } from '../models/review-question-relation.response';
import { CreateAnswerDto } from '../dto/answers/create-answer.dto';
import { AnswerResponse } from '../models/answer.response';
import { AnswerQueryDto } from '../dto/answers/answer-query.dto';
import { CreateRespondentDto } from '../dto/respondents/create-respondent.dto';
import { RespondentResponse } from '../models/respondent.response';
import { UpdateRespondentDto } from '../dto/respondents/update-respondent.dto';
import { CreateReviewerDto } from '../dto/reviewers/create-reviewer.dto';
import { ReviewerResponse } from '../models/reviewer.response';
import { RespondentCategory } from '@intra/shared-kernel';

@ApiTags('Feedback360 / Reviews')
@Controller('feedback360/reviews')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ReviewResponse })
export class ReviewController {
  constructor(private readonly reviews: ReviewService) { }

  @Post()
  @ApiOperation({ summary: 'Create Review' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ReviewResponse })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateReviewDto): Promise<ReviewResponse> {
    const created = await this.reviews.create(dto);
    return Feedback360HttpMapper.toReviewResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'List Reviews' })
  @ApiResponse({ status: HttpStatus.OK, type: ReviewResponse, isArray: true })
  @ApiListReadErrorResponses()
  async search(@Query() query: ReviewQueryDto): Promise<ReviewResponse[]> {
    const items = await this.reviews.search(query);
    return items.map(Feedback360HttpMapper.toReviewResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Review by id' })
  @ApiResponse({ status: HttpStatus.OK, type: ReviewResponse })
  @ApiReadErrorResponses()
  async getById(@Param('id') id: string): Promise<ReviewResponse> {
    const review = await this.reviews.getById(Number(id));
    return Feedback360HttpMapper.toReviewResponse(review);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Review' })
  @ApiResponse({ status: HttpStatus.OK, type: ReviewResponse })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateReviewDto): Promise<ReviewResponse> {
    const updated = await this.reviews.update(Number(id), dto);
    return Feedback360HttpMapper.toReviewResponse(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete Review' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async delete(@Param('id') id: string): Promise<void> {
    await this.reviews.delete(Number(id));
  }

  @Post(':id/questions')
  @ApiOperation({ summary: 'Add question from library to Review' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ReviewQuestionRelationResponse })
  @ApiCreateAndUpdateErrorResponses()
  async attachQuestion(
    @Param('id') id: string,
    @Body() dto: AttachQuestionDto,
  ): Promise<ReviewQuestionRelationResponse> {
    const relation = await this.reviews.attachQuestion({
      reviewId: Number(id),
      questionId: dto.questionId,
    });
    return Feedback360HttpMapper.toReviewQuestionRelationResponse(relation);
  }

  @Get(':id/questions')
  @ApiOperation({ summary: 'List questions in Review' })
  @ApiResponse({ status: HttpStatus.OK, type: ReviewQuestionRelationResponse, isArray: true })
  @ApiListReadErrorResponses()
  async listQuestions(@Param('id') id: string): Promise<ReviewQuestionRelationResponse[]> {
    const relations = await this.reviews.listQuestionRelations(Number(id));
    return relations.map(Feedback360HttpMapper.toReviewQuestionRelationResponse);
  }

  @Delete(':id/questions/:questionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete question from Review' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async detachQuestion(@Param('id') id: string, @Param('questionId') questionId: string): Promise<void> {
    await this.reviews.detachQuestion(Number(id), Number(questionId));
  }

  @Post(':id/answers')
  @ApiOperation({ summary: 'Add answer to Review' })
  @ApiResponse({ status: HttpStatus.CREATED, type: AnswerResponse })
  @ApiCreateAndUpdateErrorResponses()
  async addAnswer(@Param('id') id: string, @Body() dto: CreateAnswerDto): Promise<AnswerResponse> {
    const created = await this.reviews.addAnswer({
      reviewId: Number(id),
      questionId: dto.questionId,
      respondentCategory: dto.respondentCategory,
      answerType: dto.answerType,
      numericalValue: dto.numericalValue,
      textValue: dto.textValue,
    });
    return Feedback360HttpMapper.toAnswerResponse(created);
  }

  @Get(':id/answers')
  @ApiOperation({ summary: 'List answers to Review' })
  @ApiResponse({ status: HttpStatus.OK, type: AnswerResponse, isArray: true })
  @ApiListReadErrorResponses()
  async listAnswers(@Param('id') id: string, @Query() query: AnswerQueryDto): Promise<AnswerResponse[]> {
    const answers = await this.reviews.listAnswers(Number(id), query.respondentCategory as RespondentCategory | undefined);
    return answers.map(Feedback360HttpMapper.toAnswerResponse);
  }

  @Post(':id/respondents')
  @ApiOperation({ summary: 'Add respondent to Review' })
  @ApiResponse({ status: HttpStatus.CREATED, type: RespondentResponse })
  @ApiCreateAndUpdateErrorResponses()
  async addRespondent(@Param('id') id: string, @Body() dto: CreateRespondentDto): Promise<RespondentResponse> {
    const relation = await this.reviews.addRespondent({
      reviewId: Number(id),
      respondentId: dto.respondentId,
      category: dto.category,
      responseStatus: dto.responseStatus,
      respondentNote: dto.respondentNote,
      hrNote: dto.hrNote,
      positionId: dto.positionId,
      positionTitle: dto.positionTitle,
      invitedAt: dto.invitedAt,
      canceledAt: dto.canceledAt,
      respondedAt: dto.respondedAt,
    });
    return Feedback360HttpMapper.toRespondentResponse(relation);
  }

  @Get(':id/respondents')
  @ApiOperation({ summary: 'List respondents to Review' })
  @ApiResponse({ status: HttpStatus.OK, type: RespondentResponse, isArray: true })
  @ApiListReadErrorResponses()
  async listRespondents(@Param('id') id: string): Promise<RespondentResponse[]> {
    const relations = await this.reviews.listRespondents({ reviewId: Number(id) });
    return relations.map(Feedback360HttpMapper.toRespondentResponse);
  }

  @Patch('respondents/:relationId')
  @ApiOperation({ summary: 'Update respondent status' })
  @ApiResponse({ status: HttpStatus.OK, type: RespondentResponse })
  @ApiCreateAndUpdateErrorResponses()
  async updateRespondent(
    @Param('relationId') relationId: string,
    @Body() dto: UpdateRespondentDto,
  ): Promise<RespondentResponse> {
    const updated = await this.reviews.updateRespondent(Number(relationId), dto);
    return Feedback360HttpMapper.toRespondentResponse(updated);
  }

  @Delete('respondents/:relationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete respondent from Review' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async deleteRespondent(@Param('relationId') relationId: string): Promise<void> {
    await this.reviews.removeRespondent(Number(relationId));
  }

  @Post(':id/reviewers')
  @ApiOperation({ summary: 'Add reviewer to Review' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ReviewerResponse })
  @ApiCreateAndUpdateErrorResponses()
  async addReviewer(@Param('id') id: string, @Body() dto: CreateReviewerDto): Promise<ReviewerResponse> {
    const created = await this.reviews.addReviewer({
      reviewId: Number(id),
      reviewerId: dto.reviewerId,
      positionId: dto.positionId,
      positionTitle: dto.positionTitle,
    });
    return Feedback360HttpMapper.toReviewerResponse(created);
  }

  @Get(':id/reviewers')
  @ApiOperation({ summary: 'List reviewers to Review' })
  @ApiResponse({ status: HttpStatus.OK, type: ReviewerResponse, isArray: true })
  @ApiListReadErrorResponses()
  async listReviewers(@Param('id') id: string): Promise<ReviewerResponse[]> {
    const reviewers = await this.reviews.listReviewers(Number(id));
    return reviewers.map(Feedback360HttpMapper.toReviewerResponse);
  }

  @Delete('reviewers/:relationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete reviewer from Review' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async deleteReviewer(@Param('relationId') relationId: string): Promise<void> {
    await this.reviews.removeReviewer(Number(relationId));
  }
}
