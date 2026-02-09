import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
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
import { ReviewService } from '../../../application/services/review.service';
import { ClusterScoreQueryDto } from '../dto/cluster-scores/cluster-score-query.dto';
import { UpsertClusterScoreDto } from '../dto/cluster-scores/upsert-cluster-score.dto';
import { Feedback360HttpMapper } from '../mappers/feedback360.http.mapper';
import { ClusterScoreWithRelationsResponse } from '../models/cluster-score-with-relations.response';
import { ClusterScoreResponse } from '../models/cluster-score.response';
@ApiTags('Feedback360 / Cluster Scores')
@Controller('feedback360/cluster-scores')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ClusterScoreResponse })
export class ClusterScoresController {
    constructor(private readonly reviews: ReviewService) {}

    @Post()
    @ApiOperation({ summary: 'Save or update cluster score' })
    @ApiBody({ type: UpsertClusterScoreDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: ClusterScoreResponse })
    @ApiCreateAndUpdateErrorResponses()
    async upsert(
        @Body() dto: UpsertClusterScoreDto,
    ): Promise<ClusterScoreResponse> {
        const saved = await this.reviews.upsertClusterScore(dto);
        return Feedback360HttpMapper.toClusterScoreResponse(saved);
    }

    @Get()
    @ApiOperation({ summary: 'List cluster scores' })
    @ApiQuery({ type: ClusterScoreQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ClusterScoreResponse,
        isArray: true,
        description: 'Default sort by ascending id',
    })
    @ApiListReadErrorResponses()
    async list(
        @Query() query: ClusterScoreQueryDto,
    ): Promise<ClusterScoreResponse[]> {
        const scores = await this.reviews.listClusterScores(query);
        return scores.map((score) =>
            Feedback360HttpMapper.toClusterScoreResponse(score),
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get cluster score by id' })
    @ApiParam({ name: 'id', description: 'Cluster score id', type: 'number' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ClusterScoreWithRelationsResponse,
    })
    @ApiReadErrorResponses()
    async getById(
        @Param('id') id: string,
    ): Promise<ClusterScoreWithRelationsResponse> {
        const score = await this.reviews.getClusterScoreById(Number(id));
        return Feedback360HttpMapper.toClusterScoreWithRelationsResponse(score);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete cluster score' })
    @ApiParam({ name: 'id', description: 'Cluster score id', type: 'number' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async delete(@Param('id') id: string): Promise<void> {
        await this.reviews.removeClusterScore(Number(id));
    }

    @Get('cycle/:cycleId')
    @ApiOperation({ summary: 'Get cluster scores by cycle id' })
    @ApiParam({ name: 'cycleId', description: 'Cycle id', type: 'number' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ClusterScoreWithRelationsResponse,
        isArray: true,
        description: 'Default sort by ascending cluster id and score',
    })
    @ApiListReadErrorResponses()
    async getByCycleId(
        @Param('cycleId') cycleId: string,
    ): Promise<ClusterScoreWithRelationsResponse[]> {
        const scores = await this.reviews.getClusterScoreByCycleId(
            Number(cycleId),
        );
        return scores.map((score) =>
            Feedback360HttpMapper.toClusterScoreWithRelationsResponse(score),
        );
    }
}
