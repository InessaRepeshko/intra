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
import { CompetenceClusterService } from '../../../application/services/competence-cluster.service';
import { CreateCompetenceClusterDto } from '../dto/clusters/create-competence-cluster.dto';
import { CompetenceClusterResponse } from '../models/competence-cluster.response';
import { CompetenceClusterHttpMapper } from '../mappers/competence-cluster.http.mapper';
import { CompetenceClusterQueryDto } from '../dto/clusters/competence-cluster-query.dto';
import { UpdateCompetenceClusterDto } from '../dto/clusters/update-competence-cluster.dto';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';

@ApiTags('Competence / Clusters')
@Controller('competence/clusters')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: CompetenceClusterResponse })
export class CompetenceClustersController {
  constructor(private readonly service: CompetenceClusterService) {}

  @Post()
  @ApiOperation({ summary: 'Create competence cluster' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CompetenceClusterResponse })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateCompetenceClusterDto): Promise<CompetenceClusterResponse> {
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
    return CompetenceClusterHttpMapper.toResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'Search competence clusters' })
  @ApiResponse({ status: HttpStatus.OK, type: CompetenceClusterResponse, isArray: true })
  @ApiListReadErrorResponses()
  async search(@Query() query: CompetenceClusterQueryDto): Promise<CompetenceClusterResponse[]> {
    const clusters = await this.service.search(query);
    return clusters.map(CompetenceClusterHttpMapper.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get competence cluster by id' })
  @ApiResponse({ status: HttpStatus.OK, type: CompetenceClusterResponse })
  @ApiReadErrorResponses()
  async getById(@Param('id') id: string): Promise<CompetenceClusterResponse> {
    const cluster = await this.service.getById(Number(id));
    return CompetenceClusterHttpMapper.toResponse(cluster);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update competence cluster' })
  @ApiResponse({ status: HttpStatus.OK, type: CompetenceClusterResponse })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateCompetenceClusterDto): Promise<CompetenceClusterResponse> {
    const updated = await this.service.update(Number(id), dto);
    return CompetenceClusterHttpMapper.toResponse(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete competence cluster' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(Number(id));
  }
}

