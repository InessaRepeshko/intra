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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiReadErrorResponses } from 'src/common/documentation/api.error.responses.decorator';
import { ReportingService } from '../../../application/services/reporting.service';
import { ReportingHttpMapper } from '../mappers/reporting.http.mapper';
import { ReportResponse } from '../models/report.response';

@ApiTags('Reporting / Reports')
@Controller('reporting/reports')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ReportResponse })
export class ReportingController {
    constructor(private readonly reporting: ReportingService) {}

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
    ): Promise<ReportResponse> {
        const report = await this.reporting.getById(id);
        return ReportingHttpMapper.toReportResponse(report);
    }

    @Get('review/:reviewId')
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
    ): Promise<ReportResponse> {
        const report = await this.reporting.getByReviewId(reviewId);
        return ReportingHttpMapper.toReportResponse(report);
    }
}
