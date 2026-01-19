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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { Feedback360Service } from '../../../application/services/feedback360.service';
import { UpsertClusterScoreDto } from '../dto/cluster-scores/upsert-cluster-score.dto';
import { ClusterScoreResponse } from '../models/cluster-score.response';
import { PerformanceHttpMapper } from '../mappers/performance.http.mapper';
import { ClusterScoreQueryDto } from '../dto/cluster-scores/cluster-score-query.dto';

@ApiTags('Performance / Cluster Scores')
@Controller('performance/cluster-scores')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ClusterScoreResponse })
export class ClusterScoresController {
  constructor(private readonly feedbacks: Feedback360Service) { }

  @Post()
  @ApiOperation({ summary: 'Save or update cluster score' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ClusterScoreResponse })
  @ApiCreateAndUpdateErrorResponses()
  async upsert(@Body() dto: UpsertClusterScoreDto): Promise<ClusterScoreResponse> {
    const saved = await this.feedbacks.upsertClusterScore(dto);
    return PerformanceHttpMapper.toClusterScoreResponse(saved);
  }

  @Get()
  @ApiOperation({ summary: 'List cluster scores' })
  @ApiResponse({ status: HttpStatus.OK, type: ClusterScoreResponse, isArray: true })
  @ApiListReadErrorResponses()
  async list(@Query() query: ClusterScoreQueryDto): Promise<ClusterScoreResponse[]> {
    const scores = await this.feedbacks.listClusterScores(query);
    return scores.map(PerformanceHttpMapper.toClusterScoreResponse);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete cluster score' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async delete(@Param('id') id: string): Promise<void> {
    await this.feedbacks.removeClusterScore(Number(id));
  }
}
