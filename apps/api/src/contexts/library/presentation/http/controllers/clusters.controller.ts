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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClusterService } from '../../../application/services/cluster.service';
import { CreateClusterDto } from '../dto/clusters/create-cluster.dto';
import { ClusterResponse } from '../models/cluster.response';
import { ClusterHttpMapper } from '../mappers/cluster.http.mapper';
import { ClusterQueryDto } from '../dto/clusters/cluster-query.dto';
import { UpdateClusterDto } from '../dto/clusters/update-cluster.dto';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';

@ApiTags('Library / Clusters')
@Controller('library/clusters')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ClusterResponse })
export class ClustersController {
  constructor(private readonly service: ClusterService) { }

  @Post()
  @ApiOperation({ summary: 'Create cluster' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ClusterResponse })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateClusterDto): Promise<ClusterResponse> {
    const created = await this.service.create({
      competenceId: dto.competenceId,
      cycleId: dto.cycleId,
      lowerBound: dto.lowerBound,
      upperBound: dto.upperBound,
      minScore: dto.minScore,
      maxScore: dto.maxScore,
      averageScore: dto.averageScore,
      employeesCount: dto.employeesCount,
    });
    return ClusterHttpMapper.toResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'Search clusters' })
  @ApiResponse({ status: HttpStatus.OK, type: ClusterResponse, isArray: true })
  @ApiListReadErrorResponses()
  async search(@Query() query: ClusterQueryDto): Promise<ClusterResponse[]> {
    const clusters = await this.service.search(query);
    return clusters.map(ClusterHttpMapper.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cluster by id' })
  @ApiResponse({ status: HttpStatus.OK, type: ClusterResponse })
  @ApiReadErrorResponses()
  async getById(@Param('id') id: string): Promise<ClusterResponse> {
    const cluster = await this.service.getById(Number(id));
    return ClusterHttpMapper.toResponse(cluster);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update cluster' })
  @ApiResponse({ status: HttpStatus.OK, type: ClusterResponse })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateClusterDto): Promise<ClusterResponse> {
    const updated = await this.service.update(Number(id), dto);
    return ClusterHttpMapper.toResponse(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete cluster' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(Number(id));
  }
}

