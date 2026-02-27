import { IdentityRole } from '@intra/shared-kernel';
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
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthSessionGuard } from 'src/auth/guards/auth-session.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
    ApiCreateAndUpdateErrorResponses,
    ApiDeletionErrorResponses,
    ApiListReadErrorResponses,
    ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { ReviewService } from '../../../application/services/review.service';
import { AnswerQueryDto } from '../dto/answers/answer-query.dto';
import { CreateAnswerDto } from '../dto/answers/create-answer.dto';
import { CreateRespondentDto } from '../dto/respondents/create-respondent.dto';
import { RespondentQueryDto } from '../dto/respondents/respondent-query.dto';
import { UpdateRespondentDto } from '../dto/respondents/update-respondent.dto';
import { AttachQuestionToReviewDto } from '../dto/review-question-relations/attach-question.dto';
import { ReviewQuestionRelationQueryDto } from '../dto/review-question-relations/review-question-relation-query.dto';
import { CreateReviewerDto } from '../dto/reviewers/create-reviewer.dto';
import { ReviewerQueryDto } from '../dto/reviewers/reviewer-query.dto';
import { CreateReviewDto } from '../dto/reviews/create-review.dto';
import { ReviewQueryDto } from '../dto/reviews/review-query.dto';
import { UpdateReviewDto } from '../dto/reviews/update-review.dto';
import { AnswerHttpMapper } from '../mappers/answer.http.mapper';
import { RespondentHttpMapper } from '../mappers/respondent.http.mapper';
import { ReviewQuestionRelationHttpMapper } from '../mappers/review-question-relation.http.mapper';
import { ReviewHttpMapper } from '../mappers/review.http.mapper';
import { ReviewerHttpMapper } from '../mappers/reviewer.http.mapper';
import { AnswerResponse } from '../models/answer.response';
import { RespondentResponse } from '../models/respondent.response';
import { ReviewQuestionRelationResponse } from '../models/review-question-relation.response';
import { ReviewResponse } from '../models/review.response';
import { ReviewerResponse } from '../models/reviewer.response';

@ApiTags('Feedback360 / Reviews')
@Controller('feedback360/reviews')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ReviewResponse })
@UseGuards(AuthSessionGuard, RolesGuard)
@Roles(IdentityRole.ADMIN, IdentityRole.HR)
export class ReviewController {
    constructor(private readonly reviews: ReviewService) {}

    @Post()
    @ApiOperation({ summary: 'Create Review' })
    @ApiBody({ type: CreateReviewDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: ReviewResponse })
    @ApiCreateAndUpdateErrorResponses()
    async create(@Body() dto: CreateReviewDto): Promise<ReviewResponse> {
        const created = await this.reviews.create(dto);
        return ReviewHttpMapper.toResponse(created);
    }

    @Get()
    @ApiOperation({ summary: 'List Reviews' })
    @ApiQuery({ type: ReviewQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ReviewResponse,
        isArray: true,
        description: 'Default sort by ascending id',
    })
    @ApiListReadErrorResponses()
    async search(@Query() query: ReviewQueryDto): Promise<ReviewResponse[]> {
        const items = await this.reviews.search(query);
        return items.map(ReviewHttpMapper.toResponse);
    }

    @Get(':id')
    @Roles(
        IdentityRole.ADMIN,
        IdentityRole.HR,
        IdentityRole.MANAGER,
        IdentityRole.EMPLOYEE,
    )
    @ApiOperation({ summary: 'Get Review by id' })
    @ApiParam({ name: 'id', description: 'Review id', type: 'number' })
    @ApiResponse({ status: HttpStatus.OK, type: ReviewResponse })
    @ApiReadErrorResponses()
    async getById(
        @Param('id') id: string,
        @CurrentUser() actor: UserDomain,
    ): Promise<ReviewResponse> {
        const review = await this.reviews.getById(Number(id), actor);
        return ReviewHttpMapper.toResponse(review);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update Review' })
    @ApiParam({ name: 'id', description: 'Review id', type: 'number' })
    @ApiBody({ type: UpdateReviewDto })
    @ApiResponse({ status: HttpStatus.OK, type: ReviewResponse })
    @ApiCreateAndUpdateErrorResponses()
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateReviewDto,
    ): Promise<ReviewResponse> {
        const updated = await this.reviews.update(Number(id), dto);
        return ReviewHttpMapper.toResponse(updated);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete Review' })
    @ApiParam({ name: 'id', description: 'Review id', type: 'number' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async delete(@Param('id') id: string): Promise<void> {
        await this.reviews.delete(Number(id));
    }

    @Post(':id/questions')
    @ApiOperation({ summary: 'Add question template from library to Review' })
    @ApiParam({ name: 'id', description: 'Review id', type: 'number' })
    @ApiBody({ type: AttachQuestionToReviewDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: ReviewQuestionRelationResponse,
    })
    @ApiCreateAndUpdateErrorResponses()
    async attachQuestion(
        @Param('id') id: string,
        @Body() dto: AttachQuestionToReviewDto,
    ): Promise<ReviewQuestionRelationResponse> {
        const relation = await this.reviews.attachQuestion({
            reviewId: Number(id),
            questionTemplateId: dto.questionTemplateId,
        });
        return ReviewQuestionRelationHttpMapper.toResponse(relation);
    }

    @Get(':id/questions')
    @Roles(
        IdentityRole.ADMIN,
        IdentityRole.HR,
        IdentityRole.MANAGER,
        IdentityRole.EMPLOYEE,
    )
    @ApiOperation({ summary: 'List questions in Review' })
    @ApiParam({ name: 'id', description: 'Review id', type: 'number' })
    @ApiQuery({ type: ReviewQuestionRelationQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ReviewQuestionRelationResponse,
        isArray: true,
        description: 'Default sort by ascending id',
    })
    @ApiListReadErrorResponses()
    async listQuestions(
        @Param('id') id: string,
        @Query() query: ReviewQuestionRelationQueryDto,
        @CurrentUser() actor: UserDomain,
    ): Promise<ReviewQuestionRelationResponse[]> {
        const relations = await this.reviews.listQuestionRelations(
            Number(id),
            query,
            actor,
        );
        return relations.map(ReviewQuestionRelationHttpMapper.toResponse);
    }

    @Delete(':id/questions/:questionId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete question from Review' })
    @ApiParam({ name: 'id', description: 'Review id', type: 'number' })
    @ApiParam({
        name: 'questionId',
        description: 'Question id',
        type: 'number',
    })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async detachQuestion(
        @Param('id') id: string,
        @Param('questionId') questionId: string,
    ): Promise<void> {
        await this.reviews.detachQuestion(Number(id), Number(questionId));
    }

    @Post(':id/answers')
    @Roles(
        IdentityRole.ADMIN,
        IdentityRole.HR,
        IdentityRole.MANAGER,
        IdentityRole.EMPLOYEE,
    )
    @ApiOperation({ summary: 'Add answer to Review' })
    @ApiParam({ name: 'id', description: 'Review id', type: 'number' })
    @ApiBody({ type: CreateAnswerDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: AnswerResponse })
    @ApiCreateAndUpdateErrorResponses()
    async addAnswer(
        @Param('id') id: string,
        @Body() dto: CreateAnswerDto,
        @CurrentUser() actor: UserDomain,
    ): Promise<AnswerResponse> {
        const created = await this.reviews.addAnswer(
            {
                reviewId: Number(id),
                questionId: dto.questionId,
                respondentCategory: dto.respondentCategory,
                answerType: dto.answerType,
                numericalValue: dto.numericalValue,
                textValue: dto.textValue,
            },
            actor,
        );
        return AnswerHttpMapper.toResponse(created);
    }

    @Get(':id/answers')
    @Roles(
        IdentityRole.ADMIN,
        IdentityRole.HR,
        IdentityRole.MANAGER,
        IdentityRole.EMPLOYEE,
    )
    @ApiOperation({ summary: 'List answers to Review' })
    @ApiParam({ name: 'id', description: 'Review id', type: 'number' })
    @ApiQuery({ type: AnswerQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: AnswerResponse,
        isArray: true,
        description: 'Default sort by ascending id',
    })
    @ApiListReadErrorResponses()
    async listAnswers(
        @Param('id') id: string,
        @Query() query: AnswerQueryDto,
        @CurrentUser() actor: UserDomain,
    ): Promise<AnswerResponse[]> {
        const answers = await this.reviews.listAnswers(
            Number(id),
            query.respondentCategory,
            actor,
        );
        return answers.map(AnswerHttpMapper.toResponse);
    }

    @Post(':id/respondents')
    @ApiOperation({ summary: 'Add respondent to Review' })
    @ApiParam({ name: 'id', description: 'Review id', type: 'number' })
    @ApiBody({ type: CreateRespondentDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: RespondentResponse })
    @ApiCreateAndUpdateErrorResponses()
    async addRespondent(
        @Param('id') id: string,
        @Body() dto: CreateRespondentDto,
    ): Promise<RespondentResponse> {
        const relation = await this.reviews.addRespondent({
            reviewId: Number(id),
            respondentId: dto.respondentId,
            fullName: dto.fullName,
            category: dto.category,
            responseStatus: dto.responseStatus,
            respondentNote: dto.respondentNote,
            hrNote: dto.hrNote,
            positionId: dto.positionId,
            positionTitle: dto.positionTitle,
            teamId: dto.teamId,
            teamTitle: dto.teamTitle,
            invitedAt: dto.invitedAt,
            canceledAt: dto.canceledAt,
            respondedAt: dto.respondedAt,
        });
        return RespondentHttpMapper.toResponse(relation);
    }

    @Get(':id/respondents')
    @ApiOperation({ summary: 'List respondents to Review' })
    @ApiParam({ name: 'id', description: 'Review id', type: 'number' })
    @ApiQuery({ type: RespondentQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: RespondentResponse,
        isArray: true,
        description: 'Default sort by ascending id',
    })
    @ApiListReadErrorResponses()
    async listRespondents(
        @Param('id') id: string,
        @Query() query: RespondentQueryDto,
    ): Promise<RespondentResponse[]> {
        const relations = await this.reviews.listRespondents(Number(id), query);
        return relations.map(RespondentHttpMapper.toResponse);
    }

    @Patch('respondents/:relationId')
    @Roles(
        IdentityRole.ADMIN,
        IdentityRole.HR,
        IdentityRole.MANAGER,
        IdentityRole.EMPLOYEE,
    )
    @ApiOperation({ summary: 'Update respondent status' })
    @ApiParam({
        name: 'relationId',
        description: 'Respondent relation id',
        type: 'number',
    })
    @ApiBody({ type: UpdateRespondentDto })
    @ApiResponse({ status: HttpStatus.OK, type: RespondentResponse })
    @ApiCreateAndUpdateErrorResponses()
    async updateRespondent(
        @Param('relationId') relationId: string,
        @Body() dto: UpdateRespondentDto,
        @CurrentUser() actor: UserDomain,
    ): Promise<RespondentResponse> {
        const updated = await this.reviews.updateRespondent(
            Number(relationId),
            dto,
            actor,
        );
        return RespondentHttpMapper.toResponse(updated);
    }

    @Delete('respondents/:relationId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete respondent from Review' })
    @ApiParam({
        name: 'relationId',
        description: 'Respondent relation id',
        type: 'number',
    })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async deleteRespondent(
        @Param('relationId') relationId: string,
    ): Promise<void> {
        await this.reviews.removeRespondent(Number(relationId));
    }

    @Post(':id/reviewers')
    @ApiOperation({ summary: 'Add reviewer to Review' })
    @ApiParam({ name: 'id', description: 'Review id', type: 'number' })
    @ApiBody({ type: CreateReviewerDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: ReviewerResponse })
    @ApiCreateAndUpdateErrorResponses()
    async addReviewer(
        @Param('id') id: string,
        @Body() dto: CreateReviewerDto,
    ): Promise<ReviewerResponse> {
        const created = await this.reviews.addReviewer({
            reviewId: Number(id),
            reviewerId: dto.reviewerId,
            fullName: dto.fullName,
            positionId: dto.positionId,
            positionTitle: dto.positionTitle,
            teamId: dto.teamId,
            teamTitle: dto.teamTitle,
        });
        return ReviewerHttpMapper.toResponse(created);
    }

    @Get(':id/reviewers')
    @Roles(
        IdentityRole.ADMIN,
        IdentityRole.HR,
        IdentityRole.MANAGER,
        IdentityRole.EMPLOYEE,
    )
    @ApiOperation({ summary: 'List reviewers to Review' })
    @ApiParam({ name: 'id', description: 'Review id', type: 'number' })
    @ApiQuery({ type: ReviewerQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ReviewerResponse,
        isArray: true,
        description: 'Default sort by ascending id',
    })
    @ApiListReadErrorResponses()
    async listReviewers(
        @Param('id') id: string,
        @Query() query: ReviewerQueryDto,
        @CurrentUser() actor: UserDomain,
    ): Promise<ReviewerResponse[]> {
        const reviewers = await this.reviews.listReviewers(
            Number(id),
            query,
            actor,
        );
        return reviewers.map(ReviewerHttpMapper.toResponse);
    }

    @Delete('reviewers/:relationId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete reviewer from Review' })
    @ApiParam({
        name: 'relationId',
        description: 'Reviewer relation id',
        type: 'number',
    })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async deleteReviewer(
        @Param('relationId') relationId: string,
    ): Promise<void> {
        await this.reviews.removeReviewer(Number(relationId));
    }

    /**
     * MANUAL TRIGGER: HR force-completes a review
     * Transitions review to PREPARING_REPORT regardless of pending responses
     */
    @Post(':id/force-complete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Force complete Review (HR/Admin only)',
        description:
            'Manually transition review to PREPARING_REPORT stage, even if some responses are pending',
    })
    @ApiParam({ name: 'id', description: 'Review id', type: 'number' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Review stage changed to PREPARING_REPORT',
    })
    @ApiCreateAndUpdateErrorResponses()
    async forceComplete(
        @Param('id') id: string,
        @CurrentUser() user: UserDomain,
    ): Promise<{ message: string }> {
        const actorId = user.id!;
        const actorName = user.fullName;

        await this.reviews.forceCompleteReview(Number(id), actorId, actorName);

        return {
            message: `Review ${id} has been force-completed and moved to PREPARING_REPORT stage`,
        };
    }
}
