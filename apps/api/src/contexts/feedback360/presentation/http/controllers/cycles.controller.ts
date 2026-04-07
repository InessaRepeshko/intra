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
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthSessionGuard } from 'src/auth/guards/auth-session.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
    ApiCreateAndUpdateErrorResponses,
    ApiDeletionErrorResponses,
    ApiListReadErrorResponses,
    ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { CycleService } from '../../../application/services/cycle.service';
import { CreateCycleDto } from '../dto/cycles/create-cycle.dto';
import { CycleQueryDto } from '../dto/cycles/cycle-query.dto';
import { UpdateCycleDto } from '../dto/cycles/update-cycle.dto';
import { CycleHttpMapper } from '../mappers/cycle.http.mapper';
import { CycleResponse } from '../models/cycle.response';

@ApiTags('Feedback360 / Cycles')
@Controller('feedback360/cycles')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: CycleResponse })
@UseGuards(AuthSessionGuard, RolesGuard)
@Roles(IdentityRole.ADMIN, IdentityRole.HR)
export class CyclesController {
    constructor(private readonly cycles: CycleService) {}

    @Post()
    @ApiOperation({ summary: 'Create 360-Feedback cycle' })
    @ApiBody({ type: CreateCycleDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: CycleResponse })
    @ApiCreateAndUpdateErrorResponses()
    async create(@Body() dto: CreateCycleDto): Promise<CycleResponse> {
        const created = await this.cycles.create(dto);
        return CycleHttpMapper.toResponse(created);
    }

    @Get()
    @ApiOperation({ summary: 'List 360-Feedback cycles' })
    @ApiQuery({ type: CycleQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CycleResponse,
        isArray: true,
        description: 'Default sort by ascending id',
    })
    @ApiListReadErrorResponses()
    async search(@Query() query: CycleQueryDto): Promise<CycleResponse[]> {
        const items = await this.cycles.search(query);
        return items.map(CycleHttpMapper.toResponse);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get 360-Feedback cycle by id' })
    @ApiParam({ name: 'id', description: 'Cycle id', type: 'number' })
    @ApiResponse({ status: HttpStatus.OK, type: CycleResponse })
    @ApiReadErrorResponses()
    async getById(@Param('id') id: string): Promise<CycleResponse> {
        const cycle = await this.cycles.getById(Number(id));
        return CycleHttpMapper.toResponse(cycle);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update 360-Feedback cycle' })
    @ApiParam({ name: 'id', description: 'Cycle id', type: 'number' })
    @ApiBody({ type: UpdateCycleDto })
    @ApiResponse({ status: HttpStatus.OK, type: CycleResponse })
    @ApiCreateAndUpdateErrorResponses()
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateCycleDto,
    ): Promise<CycleResponse> {
        const updated = await this.cycles.update(Number(id), dto);
        return CycleHttpMapper.toResponse(updated);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete 360-Feedback cycle' })
    @ApiParam({ name: 'id', description: 'Cycle id', type: 'number' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async delete(@Param('id') id: string): Promise<void> {
        await this.cycles.delete(Number(id));
    }

    @Post(':id/force-finish')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Force finish 360-Feedback cycle (HR/Admin only)',
        description:
            'Manually transition cycle to FINISHED stage, even if some reviews are in-progress',
    })
    @ApiParam({ name: 'id', description: 'Cycle id', type: 'number' })
    @ApiResponse({ status: HttpStatus.OK, type: CycleResponse })
    @ApiCreateAndUpdateErrorResponses()
    async forceFinish(
        @Param('id') id: string,
        @CurrentUser() user: UserDomain,
    ): Promise<CycleResponse> {
        const cycleId = Number(id);
        const actorId = user.id!;
        const actorName = user.fullName;

        await this.cycles.forceFinish(cycleId, actorId, actorName);
        const updated = await this.cycles.getById(cycleId);
        return CycleHttpMapper.toResponse(updated);
    }
}
