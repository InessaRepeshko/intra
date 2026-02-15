import { IdentityRole } from '@intra/shared-kernel';
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
    UseGuards,
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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthSessionGuard } from 'src/auth/guards/auth-session.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
    ApiCreateAndUpdateErrorResponses,
    ApiDeletionErrorResponses,
    ApiListReadErrorResponses,
    ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { ReviewService } from '../../../application/services/review.service';
import { ClusterScoreQueryDto } from '../dto/cluster-scores/cluster-score-query.dto';
import { UpsertClusterScoreDto } from '../dto/cluster-scores/upsert-cluster-score.dto';
import { ClusterScoreHttpMapper } from '../mappers/cluster-score.http.mapper';
import { ClusterScoreWithRelationsResponse } from '../models/cluster-score-with-relations.response';
import { ClusterScoreResponse } from '../models/cluster-score.response';

@ApiTags('Feedback360 / Cluster Scores')
@Controller('feedback360/cluster-scores')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ClusterScoreResponse })
@UseGuards(AuthSessionGuard, RolesGuard)
@Roles(IdentityRole.ADMIN, IdentityRole.HR)
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
        return ClusterScoreHttpMapper.toResponse(saved);
    }

    @Get()
    @Roles(IdentityRole.ADMIN, IdentityRole.HR, IdentityRole.MANAGER)
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
        return scores.map((score) => ClusterScoreHttpMapper.toResponse(score));
    }

    @Get(':id')
    @Roles(IdentityRole.ADMIN, IdentityRole.HR, IdentityRole.MANAGER)
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
        return ClusterScoreHttpMapper.toResponseWithRelations(score);
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
    @Roles(IdentityRole.ADMIN, IdentityRole.HR, IdentityRole.MANAGER)
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
            ClusterScoreHttpMapper.toResponseWithRelations(score),
        );
    }
}
