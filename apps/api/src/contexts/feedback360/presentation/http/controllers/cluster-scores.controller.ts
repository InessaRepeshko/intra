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
import { ReviewService } from '../../../application/services/review.service';
import { UpsertClusterScoreDto } from '../dto/cluster-scores/upsert-cluster-score.dto';
import { ClusterScoreResponse } from '../models/cluster-score.response';
import { Feedback360HttpMapper } from '../mappers/feedback360.http.mapper';
import { ClusterScoreQueryDto } from '../dto/cluster-scores/cluster-score-query.dto';

@ApiTags('Feedback360 / Cluster Scores')
@Controller('feedback360/cluster-scores')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ClusterScoreResponse })
export class ClusterScoresController {
  constructor(private readonly reviews: ReviewService) { }

  @Post()
  @ApiOperation({ summary: 'Save or update cluster score' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ClusterScoreResponse })
  @ApiCreateAndUpdateErrorResponses()
  async upsert(@Body() dto: UpsertClusterScoreDto): Promise<ClusterScoreResponse> {
    const saved = await this.reviews.upsertClusterScore(dto);
    return Feedback360HttpMapper.toClusterScoreResponse(saved);
  }

  @Get()
  @ApiOperation({ summary: 'List cluster scores' })
  @ApiResponse({ status: HttpStatus.OK, type: ClusterScoreResponse, isArray: true })
  @ApiListReadErrorResponses()
  async list(@Query() query: ClusterScoreQueryDto): Promise<ClusterScoreResponse[]> {
    const scores = await this.reviews.listClusterScores(query);
    return scores.map(Feedback360HttpMapper.toClusterScoreResponse);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete cluster score' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async delete(@Param('id') id: string): Promise<void> {
    await this.reviews.removeClusterScore(Number(id));
  }
}
