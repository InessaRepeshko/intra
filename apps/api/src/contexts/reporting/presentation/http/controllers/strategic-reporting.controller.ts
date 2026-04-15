import { IdentityRole } from '@intra/shared-kernel';
import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Query,
    SerializeOptions,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
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
import { StartegicReportInsightService } from '../../../application/services/startegic-report-insight.service';
import { StrategicReportAnalyticsService } from '../../../application/services/strategic-report-analytics.service';
import { StrategicReportingService } from '../../../application/services/strategic-reports.service';
import { StrategicReportQueryDto } from '../dto/strategic-report-query.dto';
import { StrategicReportInsightHttpMapper } from '../mappers/startegic-report-insight.http.mapper';
import { StrategicReportAnalyticsHttpMapper } from '../mappers/strategic-report-analytics.http.mapper';
import { StrategicReportHttpMapper } from '../mappers/strategic-report.http.mapper';
import { StrategicReportInsightResponse } from '../models/startegic-report-insight.response';
import { StrategicReportAnalyticsResponse } from '../models/strategic-report-analytics.response';
import { StrategicReportResponse } from '../models/strategic-report.response';

@ApiTags('Reporting / Strategic Reports')
@Controller('reporting/strategic-reports')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: StrategicReportResponse })
@UseGuards(AuthSessionGuard, RolesGuard)
@Roles(IdentityRole.ADMIN, IdentityRole.HR, IdentityRole.MANAGER)
export class StrategicReportingController {
    constructor(
        private readonly strategicReporting: StrategicReportingService,
        private readonly strategicAnalyticsService: StrategicReportAnalyticsService,
        private readonly strategicInsightService: StartegicReportInsightService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'List Strategic Reports' })
    @ApiQuery({ type: StrategicReportQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: StrategicReportResponse,
        isArray: true,
        description: 'Default sort by ascending id',
    })
    @ApiListReadErrorResponses()
    async search(
        @Query() query: StrategicReportQueryDto,
        @CurrentUser() actor: UserDomain,
    ): Promise<StrategicReportResponse[]> {
        const reports = await this.strategicReporting.search(query, actor);
        return reports.map(StrategicReportHttpMapper.toResponse);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get strategic report by id' })
    @ApiParam({
        name: 'id',
        description: 'Strategic report identifier',
        type: 'number',
    })
    @ApiResponse({ status: HttpStatus.OK, type: StrategicReportResponse })
    @ApiReadErrorResponses()
    async getById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() actor: UserDomain,
    ): Promise<StrategicReportResponse> {
        const report = await this.strategicReporting.getById(id, actor);
        return StrategicReportHttpMapper.toResponse(report);
    }

    @Get('cycles/:cycleId')
    @ApiOperation({ summary: 'Get strategic report by cycle id' })
    @ApiParam({
        name: 'cycleId',
        description: 'Cycle identifier',
        type: 'number',
    })
    @ApiResponse({ status: HttpStatus.OK, type: StrategicReportResponse })
    @ApiReadErrorResponses()
    async getByCycleId(
        @Param('cycleId', ParseIntPipe) cycleId: number,
        @CurrentUser() actor: UserDomain,
    ): Promise<StrategicReportResponse> {
        const report = await this.strategicReporting.getByCycleId(
            cycleId,
            actor,
        );
        return StrategicReportHttpMapper.toResponse(report);
    }

    @Get(':id/analytics')
    @ApiOperation({ summary: 'List strategic report analytics by report id' })
    @ApiParam({
        name: 'id',
        description: 'Strategic report identifier',
        type: 'number',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: StrategicReportAnalyticsResponse,
        isArray: true,
    })
    @ApiReadErrorResponses()
    async listStrategicReportAnalytics(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() actor: UserDomain,
    ): Promise<StrategicReportAnalyticsResponse[]> {
        const analytics =
            await this.strategicAnalyticsService.getByStrategicReportId(
                id,
                actor,
            );
        return analytics.map((a) =>
            StrategicReportAnalyticsHttpMapper.toResponse(a),
        );
    }

    @Get('analytics/:analyticsId')
    @ApiOperation({ summary: 'Get strategic report analytics by id' })
    @ApiParam({
        name: 'analyticsId',
        description: 'Analytics identifier',
        type: 'number',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: StrategicReportAnalyticsResponse,
    })
    @ApiReadErrorResponses()
    async getStrategicReportAnalyticsById(
        @Param('analyticsId', ParseIntPipe) analyticsId: number,
        @CurrentUser() actor: UserDomain,
    ): Promise<StrategicReportAnalyticsResponse> {
        const analytics = await this.strategicAnalyticsService.getById(
            analyticsId,
            actor,
        );
        return StrategicReportAnalyticsHttpMapper.toResponse(analytics);
    }

    @Get(':id/insights')
    @ApiOperation({ summary: 'List strategic report insights by report id' })
    @ApiParam({
        name: 'id',
        description: 'Strategic report identifier',
        type: 'number',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: StrategicReportInsightResponse,
        isArray: true,
    })
    @ApiReadErrorResponses()
    async listStrategicReportInsights(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() actor: UserDomain,
    ): Promise<StrategicReportInsightResponse[]> {
        const insights =
            await this.strategicInsightService.getByStrategicReportId(
                id,
                actor,
            );
        return insights.map((insight) =>
            StrategicReportInsightHttpMapper.toResponse(insight),
        );
    }

    @Get('insights/:insightId')
    @ApiOperation({ summary: 'Get strategic report insight by id' })
    @ApiParam({
        name: 'insightId',
        description: 'Insight identifier',
        type: 'number',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: StrategicReportInsightResponse,
    })
    @ApiReadErrorResponses()
    async getStrategicReportInsightById(
        @Param('insightId', ParseIntPipe) insightId: number,
        @CurrentUser() actor: UserDomain,
    ): Promise<StrategicReportInsightResponse> {
        const insight = await this.strategicInsightService.getById(
            insightId,
            actor,
        );
        return StrategicReportInsightHttpMapper.toResponse(insight);
    }
}
