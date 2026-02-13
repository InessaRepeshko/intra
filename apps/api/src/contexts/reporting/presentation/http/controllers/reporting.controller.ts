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
import { ReportingService } from '../../../application/services/reporting.service';
import { TextAnswerService } from '../../../application/services/text-answer.service';
import { ReportHttpMapper } from '../mappers/report.http.mapper';
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
    ) {}

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
}
