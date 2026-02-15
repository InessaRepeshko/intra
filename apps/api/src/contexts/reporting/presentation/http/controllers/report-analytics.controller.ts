import { IdentityRole } from '@intra/shared-kernel';
import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    SerializeOptions,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthSessionGuard } from 'src/auth/guards/auth-session.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiReadErrorResponses } from 'src/common/documentation/api.error.responses.decorator';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { ReportAnalyticsService } from '../../../application/services/report-analytics.service';
import { ReportAnalyticsHttpMapper } from '../mappers/report-analytics.http.mapper';
import { ReportAnalyticsResponse } from '../models/report-analytics.response';

@ApiTags('Reporting / Analytics')
@Controller('reporting/analytics')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ReportAnalyticsResponse })
@UseGuards(AuthSessionGuard, RolesGuard)
@Roles(
    IdentityRole.ADMIN,
    IdentityRole.HR,
    IdentityRole.MANAGER,
    IdentityRole.EMPLOYEE,
)
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
        @CurrentUser() actor: UserDomain,
    ): Promise<ReportAnalyticsResponse[]> {
        const analytics = await this.analyticsService.getByReportId(
            reportId,
            actor,
        );
        return analytics.map((a) => ReportAnalyticsHttpMapper.toResponse(a));
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
        @CurrentUser() actor: UserDomain,
    ): Promise<ReportAnalyticsResponse> {
        const analytics = await this.analyticsService.getById(id, actor);
        return ReportAnalyticsHttpMapper.toResponse(analytics);
    }
}
