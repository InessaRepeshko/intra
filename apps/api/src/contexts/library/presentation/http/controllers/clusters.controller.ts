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
    Patch,
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
import { ClusterService } from '../../../application/services/cluster.service';
import { ClusterQueryDto } from '../dto/clusters/cluster-query.dto';
import { CreateClusterDto } from '../dto/clusters/create-cluster.dto';
import { UpdateClusterDto } from '../dto/clusters/update-cluster.dto';
import { ClusterHttpMapper } from '../mappers/cluster.http.mapper';
import { ClusterResponse } from '../models/cluster.response';

@ApiTags('Library / Clusters')
@Controller('library/clusters')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ClusterResponse })
@UseGuards(AuthSessionGuard, RolesGuard)
@Roles(IdentityRole.ADMIN, IdentityRole.HR)
export class ClustersController {
    constructor(private readonly service: ClusterService) {}

    @Post()
    @ApiOperation({ summary: 'Create cluster' })
    @ApiBody({ type: CreateClusterDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: ClusterResponse })
    @ApiCreateAndUpdateErrorResponses()
    async create(@Body() dto: CreateClusterDto): Promise<ClusterResponse> {
        const created = await this.service.create({
            competenceId: dto.competenceId,
            lowerBound: dto.lowerBound,
            upperBound: dto.upperBound,
            title: dto.title,
            description: dto.description,
        });
        return ClusterHttpMapper.toResponse(created);
    }

    @Get()
    @ApiOperation({ summary: 'Search clusters' })
    @ApiQuery({ type: ClusterQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ClusterResponse,
        isArray: true,
    })
    @ApiListReadErrorResponses()
    async search(@Query() query: ClusterQueryDto): Promise<ClusterResponse[]> {
        const clusters = await this.service.search(query);
        return clusters.map(ClusterHttpMapper.toResponse);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get cluster by id' })
    @ApiParam({ name: 'id', type: 'number', required: true })
    @ApiResponse({ status: HttpStatus.OK, type: ClusterResponse })
    @ApiReadErrorResponses()
    async getById(@Param('id') id: string): Promise<ClusterResponse> {
        const cluster = await this.service.getById(Number(id));
        return ClusterHttpMapper.toResponse(cluster);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update cluster' })
    @ApiParam({ name: 'id', type: 'number', required: true })
    @ApiBody({ type: UpdateClusterDto })
    @ApiResponse({ status: HttpStatus.OK, type: ClusterResponse })
    @ApiCreateAndUpdateErrorResponses()
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateClusterDto,
    ): Promise<ClusterResponse> {
        const updated = await this.service.update(Number(id), dto);
        return ClusterHttpMapper.toResponse(updated);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete cluster' })
    @ApiParam({ name: 'id', type: 'number', required: true })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async delete(@Param('id') id: string): Promise<void> {
        await this.service.delete(Number(id));
    }
}
