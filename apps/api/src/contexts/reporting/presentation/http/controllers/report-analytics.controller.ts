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
import { ReportAnalyticsService } from '../../../application/services/report-analytics.service';
import { ReportingHttpMapper } from '../mappers/reporting.http.mapper';
import { ReportAnalyticsResponse } from '../models/report-analytics.response';

@ApiTags('Reporting / Analytics')
@Controller('reporting/analytics')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ReportAnalyticsResponse })
export class ReportAnalyticsController {
    constructor(private readonly analyticsService: ReportAnalyticsService) {}

    @Get('report/:reportId')
    @ApiOperation({ summary: 'Get analytics by report id' })
    @ApiParam({
        name: 'reportId',
        description: 'Report identifier',
        type: 'number',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ReportAnalyticsResponse,
        isArray: true,
    })
    @ApiReadErrorResponses()
    async getByReportId(
        @Param('reportId', ParseIntPipe) reportId: number,
    ): Promise<ReportAnalyticsResponse[]> {
        const analytics = await this.analyticsService.getByReportId(reportId);
        return analytics.map((a) =>
            ReportingHttpMapper.toReportAnalyticsResponse(a),
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get analytics by id' })
    @ApiParam({
        name: 'id',
        description: 'Analytics identifier',
        type: 'number',
    })
    @ApiResponse({ status: HttpStatus.OK, type: ReportAnalyticsResponse })
    @ApiReadErrorResponses()
    async getById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ReportAnalyticsResponse> {
        const analytics = await this.analyticsService.getById(id);
        return ReportingHttpMapper.toReportAnalyticsResponse(analytics);
    }
}
