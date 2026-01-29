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
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {
    ApiCreateAndUpdateErrorResponses,
    ApiDeletionErrorResponses,
    ApiListReadErrorResponses,
    ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { ClusterScoreAnalyticsService } from '../../../application/services/cluster-score-analytics.service';
import { ClusterScoreAnalyticsQueryDto } from '../dto/cluster-score-analytics/cluster-score-analytics-query.dto';
import { UpdateClusterScoreAnalyticsDto } from '../dto/cluster-score-analytics/update-cluster-score-analytics.dto';
import { UpsertClusterScoreAnalyticsDto } from '../dto/cluster-score-analytics/upsert-cluster-score-analytics.dto';
import { Feedback360HttpMapper } from '../mappers/feedback360.http.mapper';
import { ClusterScoreAnalyticsResponse } from '../models/cluster-score-analytics.response';

@ApiTags('Feedback360 / Cluster Score Analytics')
@Controller('feedback360/cluster-score-analytics')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ClusterScoreAnalyticsResponse })
export class ClusterScoreAnalyticsController {
    constructor(private readonly service: ClusterScoreAnalyticsService) { }

    @Post()
    @ApiOperation({ summary: 'Create or update cluster score analytics' })
    @ApiBody({ type: UpsertClusterScoreAnalyticsDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: ClusterScoreAnalyticsResponse,
    })
    @ApiCreateAndUpdateErrorResponses()
    async upsert(
        @Body() dto: UpsertClusterScoreAnalyticsDto,
    ): Promise<ClusterScoreAnalyticsResponse> {
        const saved = await this.service.upsert({
            cycleId: dto.cycleId,
            clusterId: dto.clusterId,
            employeesCount: dto.employeesCount,
            minScore: dto.minScore,
            maxScore: dto.maxScore,
            averageScore: dto.averageScore,
        });
        return Feedback360HttpMapper.toClusterScoreAnalyticsResponse(saved);
    }

    @Get()
    @ApiOperation({ summary: 'Search cluster score analytics' })
    @ApiQuery({ type: ClusterScoreAnalyticsQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ClusterScoreAnalyticsResponse,
        isArray: true,
        description: 'Default sort by ascending id',
    })
    @ApiListReadErrorResponses()
    async search(
        @Query() query: ClusterScoreAnalyticsQueryDto,
    ): Promise<ClusterScoreAnalyticsResponse[]> {
        const items = await this.service.search(query);
        return items.map(Feedback360HttpMapper.toClusterScoreAnalyticsResponse);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get cluster score analytics by id' })
    @ApiParam({
        name: 'id',
        description: 'Cluster score analytics id',
        type: 'number',
    })
    @ApiResponse({ status: HttpStatus.OK, type: ClusterScoreAnalyticsResponse })
    @ApiReadErrorResponses()
    async getById(
        @Param('id') id: string,
    ): Promise<ClusterScoreAnalyticsResponse> {
        const item = await this.service.getById(Number(id));
        return Feedback360HttpMapper.toClusterScoreAnalyticsResponse(item);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update cluster score analytics' })
    @ApiParam({
        name: 'id',
        description: 'Cluster score analytics id',
        type: 'number',
    })
    @ApiBody({ type: UpdateClusterScoreAnalyticsDto })
    @ApiResponse({ status: HttpStatus.OK, type: ClusterScoreAnalyticsResponse })
    @ApiCreateAndUpdateErrorResponses()
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateClusterScoreAnalyticsDto,
    ): Promise<ClusterScoreAnalyticsResponse> {
        const updated = await this.service.update(Number(id), dto);
        return Feedback360HttpMapper.toClusterScoreAnalyticsResponse(updated);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete cluster score analytics' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async delete(@Param('id') id: string): Promise<void> {
        await this.service.delete(Number(id));
    }
}
