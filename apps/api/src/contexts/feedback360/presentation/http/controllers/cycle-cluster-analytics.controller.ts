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
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    ApiCreateAndUpdateErrorResponses,
    ApiDeletionErrorResponses,
    ApiListReadErrorResponses,
    ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { CycleClusterAnalyticsService } from '../../../application/services/cycle-cluster-analytics.service';
import { UpsertCycleClusterAnalyticsDto } from '../dto/cycle-cluster-analytics/upsert-cycle-cluster-analytics.dto';
import { UpdateCycleClusterAnalyticsDto } from '../dto/cycle-cluster-analytics/update-cycle-cluster-analytics.dto';
import { CycleClusterAnalyticsQueryDto } from '../dto/cycle-cluster-analytics/cycle-cluster-analytics-query.dto';
import { CycleClusterAnalyticsResponse } from '../models/cycle-cluster-analytics.response';
import { Feedback360HttpMapper } from '../mappers/feedback360.http.mapper';

@ApiTags('Feedback360 / Cycle Cluster Analytics')
@Controller('feedback360/cycle-cluster-analytics')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: CycleClusterAnalyticsResponse })
export class CycleClusterAnalyticsController {
    constructor(private readonly service: CycleClusterAnalyticsService) { }

    @Post()
    @ApiOperation({ summary: 'Create or update cycle cluster analytics' })
    @ApiBody({ type: UpsertCycleClusterAnalyticsDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: CycleClusterAnalyticsResponse })
    @ApiCreateAndUpdateErrorResponses()
    async upsert(@Body() dto: UpsertCycleClusterAnalyticsDto): Promise<CycleClusterAnalyticsResponse> {
        const saved = await this.service.upsert({
            cycleId: dto.cycleId,
            clusterId: dto.clusterId,
            employeesCount: dto.employeesCount,
            minScore: dto.minScore,
            maxScore: dto.maxScore,
            averageScore: dto.averageScore,
        });
        return Feedback360HttpMapper.toCycleClusterAnalyticsResponse(saved);
    }

    @Get()
    @ApiOperation({ summary: 'Search cycle cluster analytics' })
    @ApiQuery({ type: CycleClusterAnalyticsQueryDto })
    @ApiResponse({ status: HttpStatus.OK, type: CycleClusterAnalyticsResponse, isArray: true, description: 'Default sort by ascending id' })
    @ApiListReadErrorResponses()
    async search(@Query() query: CycleClusterAnalyticsQueryDto): Promise<CycleClusterAnalyticsResponse[]> {
        const items = await this.service.search(query);
        return items.map(Feedback360HttpMapper.toCycleClusterAnalyticsResponse);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get cycle cluster analytics by id' })
    @ApiParam({ name: 'id', description: 'Cycle cluster analytics id', type: 'number' })
    @ApiResponse({ status: HttpStatus.OK, type: CycleClusterAnalyticsResponse })
    @ApiReadErrorResponses()
    async getById(@Param('id') id: string): Promise<CycleClusterAnalyticsResponse> {
        const item = await this.service.getById(Number(id));
        return Feedback360HttpMapper.toCycleClusterAnalyticsResponse(item);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update cycle cluster analytics' })
    @ApiParam({ name: 'id', description: 'Cycle cluster analytics id', type: 'number' })
    @ApiBody({ type: UpdateCycleClusterAnalyticsDto })
    @ApiResponse({ status: HttpStatus.OK, type: CycleClusterAnalyticsResponse })
    @ApiCreateAndUpdateErrorResponses()
    async update(@Param('id') id: string, @Body() dto: UpdateCycleClusterAnalyticsDto): Promise<CycleClusterAnalyticsResponse> {
        const updated = await this.service.update(Number(id), dto);
        return Feedback360HttpMapper.toCycleClusterAnalyticsResponse(updated);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete cycle cluster analytics' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async delete(@Param('id') id: string): Promise<void> {
        await this.service.delete(Number(id));
    }
}
