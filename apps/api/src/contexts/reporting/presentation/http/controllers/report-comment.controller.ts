import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    SerializeOptions,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ApiReadErrorResponses } from 'src/common/documentation/api.error.responses.decorator';
import { ReportCommentService } from '../../../application/services/report-comment.service';
import { ReportingHttpMapper } from '../mappers/reporting.http.mapper';
import { ReportCommentResponse } from '../models/report-comment.response';

@ApiTags('Reporting / Comments')
@Controller('reporting/comments')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ReportCommentResponse })
export class ReportCommentController {
    constructor(private readonly commentService: ReportCommentService) { }

    @Get('report/:reportId')
    @ApiOperation({ summary: 'Get comments by report id' })
    @ApiParam({
        name: 'reportId',
        description: 'Report identifier',
        type: 'number',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ReportCommentResponse,
        isArray: true,
    })
    @ApiReadErrorResponses()
    async getByReportId(
        @Param('reportId', ParseIntPipe) reportId: number,
    ): Promise<ReportCommentResponse[]> {
        const comments = await this.commentService.getByReportId(reportId);
        return comments.map(ReportingHttpMapper.toReportCommentResponse);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get comment by id' })
    @ApiParam({
        name: 'id',
        description: 'Comment identifier',
        type: 'number',
    })
    @ApiResponse({ status: HttpStatus.OK, type: ReportCommentResponse })
    @ApiReadErrorResponses()
    async getById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ReportCommentResponse> {
        const comment = await this.commentService.getById(id);
        return ReportingHttpMapper.toReportCommentResponse(comment);
    }
}
