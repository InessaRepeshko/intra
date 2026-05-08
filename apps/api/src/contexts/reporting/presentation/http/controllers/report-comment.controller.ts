import { IdentityRole } from '@intra/shared-kernel';
import {
    ClassSerializerInterceptor,
    Controller,
    SerializeOptions,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthSessionGuard } from 'src/auth/guards/auth-session.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ReportCommentService } from '../../../application/services/report-comment.service';
import { ReportCommentResponse } from '../models/report-comment.response';

@ApiTags('Reporting / Comments')
@Controller('reporting/comments')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ReportCommentResponse })
@UseGuards(AuthSessionGuard, RolesGuard)
@Roles(IdentityRole.ADMIN, IdentityRole.HR)
export class ReportCommentController {
    constructor(private readonly commentService: ReportCommentService) {}

    // @Get('report/:reportId')
    // @Roles(
    //     IdentityRole.ADMIN,
    //     IdentityRole.HR,
    //     IdentityRole.MANAGER,
    //     IdentityRole.EMPLOYEE,
    // )
    // @ApiOperation({ summary: 'Get comments by report id' })
    // @ApiParam({
    //     name: 'reportId',
    //     description: 'Report identifier',
    //     type: 'number',
    // })
    // @ApiResponse({
    //     status: HttpStatus.OK,
    //     type: ReportCommentResponse,
    //     isArray: true,
    // })
    // @ApiReadErrorResponses()
    // async getByReportId(
    //     @Param('reportId', ParseIntPipe) reportId: number,
    //     @CurrentUser() actor: UserDomain,
    // ): Promise<ReportCommentResponse[]> {
    //     const comments = await this.commentService.getByReportId(
    //         reportId,
    //         actor,
    //     );
    //     return comments.map(ReportCommentHttpMapper.toResponse);
    // }

    // @Get(':id')
    // @ApiOperation({ summary: 'Get comment by id' })
    // @ApiParam({
    //     name: 'id',
    //     description: 'Comment identifier',
    //     type: 'number',
    // })
    // @ApiResponse({ status: HttpStatus.OK, type: ReportCommentResponse })
    // @ApiReadErrorResponses()
    // async getById(
    //     @Param('id', ParseIntPipe) id: number,
    // ): Promise<ReportCommentResponse> {
    //     const comment = await this.commentService.getById(id);
    //     return ReportCommentHttpMapper.toResponse(comment);
    // }

    // @Post()
    // @ApiOperation({ summary: 'Create report comment' })
    // @ApiCreatedResponse({ type: ReportCommentResponse })
    // async create(
    //     @Body() payload: CreateReportCommentDto,
    // ): Promise<ReportCommentResponse> {
    //     const comment = ReportCommentDomain.create({
    //         reportId: payload.reportId,
    //         questionId: payload.questionId,
    //         questionTitle: payload.questionTitle,
    //         comment: payload.comment,
    //         respondentCategories: payload.respondentCategories,
    //         commentSentiment: payload.commentSentiment ?? null,
    //         numberOfMentions: payload.numberOfMentions,
    //     });

    //     const created = await this.commentService.create(comment);
    //     return ReportCommentHttpMapper.toResponse(created);
    // }
}
