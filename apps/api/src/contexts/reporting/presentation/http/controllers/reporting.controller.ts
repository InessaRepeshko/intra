import { IdentityRole } from '@intra/shared-kernel';
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
    SerializeOptions,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
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
    ApiListReadErrorResponses,
    ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
<<<<<<< HEAD
import { ReportInsightService } from 'src/contexts/reporting/application/services/report-insight.service';
import { ReportAnalyticsService } from '../../../application/services/report-analytics.service';
import { ReportCommentService } from '../../../application/services/report-comment.service';
import { ReportingService } from '../../../application/services/reports.service';
=======
import { ReportAnalyticsService } from '../../../application/services/report-analytics.service';
import { ReportCommentService } from '../../../application/services/report-comment.service';
import { ReportingService } from '../../../application/services/reporting.service';
>>>>>>> main
import { TextAnswerService } from '../../../application/services/text-answer.service';
import { ReportCommentDomain } from '../../../domain/report-comment.domain';
import { CreateReportCommentDto } from '../dto/create-report-comment.dto';
import { ReportQueryDto } from '../dto/report-query.dto';
import { ReportAnalyticsHttpMapper } from '../mappers/report-analytics.http.mapper';
import { ReportCommentHttpMapper } from '../mappers/report-comment.http.mapper';
<<<<<<< HEAD
import { ReportInsightHttpMapper } from '../mappers/report-insight.http.mapper';
import { ReportHttpMapper } from '../mappers/report.http.mapper';
import { ReportAnalyticsResponse } from '../models/report-analytics.response';
import { ReportCommentResponse } from '../models/report-comment.response';
import { ReportInsightResponse } from '../models/report-insight.response';
=======
import { ReportHttpMapper } from '../mappers/report.http.mapper';
import { ReportAnalyticsResponse } from '../models/report-analytics.response';
import { ReportCommentResponse } from '../models/report-comment.response';
>>>>>>> main
import { ReportResponse } from '../models/report.response';
import { TextAnswerResponse } from '../models/text-answer.response';

@ApiTags('Reporting / Reports')
@Controller('reporting/reports')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ReportResponse })
@UseGuards(AuthSessionGuard, RolesGuard)
@Roles(
    IdentityRole.ADMIN,
    IdentityRole.HR,
    IdentityRole.MANAGER,
    IdentityRole.EMPLOYEE,
)
export class ReportingController {
    constructor(
        private readonly reporting: ReportingService,
        private readonly textAnswerService: TextAnswerService,
        private readonly analyticsService: ReportAnalyticsService,
<<<<<<< HEAD
        private readonly insightService: ReportInsightService,
=======
>>>>>>> main
        private readonly commentService: ReportCommentService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'List Feedback360 Reports' })
    @ApiQuery({ type: ReportQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ReportResponse,
        isArray: true,
        description: 'Default sort by ascending id',
    })
    @ApiListReadErrorResponses()
    async search(
        @Query() query: ReportQueryDto,
        @CurrentUser() actor: UserDomain,
    ): Promise<ReportResponse[]> {
        const reports = await this.reporting.search(query, actor);
        return reports.map(ReportHttpMapper.toResponse);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get report by id' })
    @ApiParam({
        name: 'id',
        description: 'Report identifier',
        type: 'number',
    })
    @ApiResponse({ status: HttpStatus.OK, type: ReportResponse })
    @ApiReadErrorResponses()
    async getById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() actor: UserDomain,
    ): Promise<ReportResponse> {
        const report = await this.reporting.getById(id, actor);
        return ReportHttpMapper.toResponse(report);
    }

    @Get('reviews/:reviewId')
    @ApiOperation({ summary: 'Get report by review id' })
    @ApiParam({
        name: 'reviewId',
        description: 'Feedback360 review identifier',
        type: 'number',
    })
    @ApiResponse({ status: HttpStatus.OK, type: ReportResponse })
    @ApiReadErrorResponses()
    async getByReviewId(
        @Param('reviewId', ParseIntPipe) reviewId: number,
        @CurrentUser() actor: UserDomain,
    ): Promise<ReportResponse> {
        const report = await this.reporting.getByReviewId(reviewId, actor);
        return ReportHttpMapper.toResponse(report);
    }

    @Get('reviews/:reviewId/text-answers')
    @ApiOperation({ summary: 'Get anonymized text answers for a review' })
    @ApiParam({
        name: 'reviewId',
        description: 'Feedback360 review identifier',
        type: 'number',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        isArray: true,
        type: TextAnswerResponse,
    })
    @ApiReadErrorResponses()
    async getTextAnswers(
        @Param('reviewId', ParseIntPipe) reviewId: number,
        @CurrentUser() actor: UserDomain,
    ): Promise<TextAnswerResponse[]> {
        const answers = await this.textAnswerService.listByReview(
            reviewId,
            actor,
        );
        return answers.map(ReportHttpMapper.toTextAnswerResponse);
    }

    @Get(':id/analytics')
    @ApiOperation({ summary: 'List report analytics by report id' })
    @ApiParam({
        name: 'id',
        description: 'Report identifier',
        type: 'number',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ReportAnalyticsResponse,
        isArray: true,
    })
    @ApiReadErrorResponses()
    async listReportAnalytics(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() actor: UserDomain,
    ): Promise<ReportAnalyticsResponse[]> {
        const analytics = await this.analyticsService.getByReportId(id, actor);
        return analytics.map((a) => ReportAnalyticsHttpMapper.toResponse(a));
    }

    @Get('analytics/:analyticsId')
    @ApiOperation({ summary: 'Get report analytics by id' })
    @ApiParam({
        name: 'analyticsId',
        description: 'Analytics identifier',
        type: 'number',
    })
    @ApiResponse({ status: HttpStatus.OK, type: ReportAnalyticsResponse })
    @ApiReadErrorResponses()
    async getReportAnalyticsById(
        @Param('analyticsId', ParseIntPipe) analyticsId: number,
        @CurrentUser() actor: UserDomain,
    ): Promise<ReportAnalyticsResponse> {
        const analytics = await this.analyticsService.getById(
            analyticsId,
            actor,
        );
        return ReportAnalyticsHttpMapper.toResponse(analytics);
    }

<<<<<<< HEAD
    @Get(':id/insights')
    @ApiOperation({ summary: 'List report insights by report id' })
    @ApiParam({
        name: 'id',
        description: 'Report identifier',
        type: 'number',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ReportInsightResponse,
        isArray: true,
    })
    @ApiReadErrorResponses()
    async listReportInsights(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() actor: UserDomain,
    ): Promise<ReportInsightResponse[]> {
        const insights = await this.insightService.getByReportId(id, actor);
        return insights.map((insight) =>
            ReportInsightHttpMapper.toResponse(insight),
        );
    }

    @Get('insights/:insightId')
    @ApiOperation({ summary: 'Get report insight by id' })
    @ApiParam({
        name: 'insightId',
        description: 'Insight identifier',
        type: 'number',
    })
    @ApiResponse({ status: HttpStatus.OK, type: ReportInsightResponse })
    @ApiReadErrorResponses()
    async getReportInsightById(
        @Param('insightId', ParseIntPipe) insightId: number,
        @CurrentUser() actor: UserDomain,
    ): Promise<ReportInsightResponse> {
        const insight = await this.insightService.getById(insightId, actor);
        return ReportInsightHttpMapper.toResponse(insight);
    }

=======
>>>>>>> main
    @Get(':id/comments')
    @ApiOperation({ summary: 'Get report comments by report id' })
    @ApiParam({
        name: 'id',
        description: 'Report identifier',
        type: 'number',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ReportCommentResponse,
        isArray: true,
    })
    @ApiReadErrorResponses()
    async listReportComments(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() actor: UserDomain,
    ): Promise<ReportCommentResponse[]> {
        const comments = await this.commentService.getByReportId(id, actor);
        return comments.map(ReportCommentHttpMapper.toResponse);
    }

    @Get('comments/:commentId')
    @Roles(IdentityRole.ADMIN, IdentityRole.HR)
    @ApiOperation({ summary: 'Get report comment by id' })
    @ApiParam({
        name: 'commentId',
        description: 'Comment identifier',
        type: 'number',
    })
    @ApiResponse({ status: HttpStatus.OK, type: ReportCommentResponse })
    @ApiReadErrorResponses()
    async getReportCommentById(
        @Param('commentId', ParseIntPipe) commentId: number,
    ): Promise<ReportCommentResponse> {
        const comment = await this.commentService.getById(commentId);
        return ReportCommentHttpMapper.toResponse(comment);
    }

    @Post(':id/comments')
    @ApiOperation({ summary: 'Create report comment by report id' })
    @ApiParam({
        name: 'id',
        description: 'Report identifier',
        type: 'number',
    })
    @ApiCreatedResponse({ type: ReportCommentResponse })
    async create(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: CreateReportCommentDto,
    ): Promise<ReportCommentResponse> {
        const comment = ReportCommentDomain.create({
            reportId: id ?? payload.reportId,
            questionId: payload.questionId,
            questionTitle: payload.questionTitle,
            comment: payload.comment,
            respondentCategories: payload.respondentCategories,
            commentSentiment: payload.commentSentiment ?? null,
            numberOfMentions: payload.numberOfMentions,
        });

        const created = await this.commentService.create(comment);
        return ReportCommentHttpMapper.toResponse(created);
    }
}
