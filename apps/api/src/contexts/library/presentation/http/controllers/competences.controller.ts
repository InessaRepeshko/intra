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
import { CompetenceService } from '../../../application/services/competence.service';
import { AttachPositionCompetenceDto } from '../dto/competences/attach-position-competence.dto';
import { AttachQuestionTemplateCompetenceDto } from '../dto/competences/attach-question-template-competence.dto';
import { CompetenceQueryDto } from '../dto/competences/competence-query.dto';
import { CreateCompetenceDto } from '../dto/competences/create-competence.dto';
import { UpdateCompetenceDto } from '../dto/competences/update-competence.dto';
import { CompetenceHttpMapper } from '../mappers/competence.http.mapper';
import { CompetenceResponse } from '../models/competence.response';

@ApiTags('Library / Competences')
@Controller('library/competences')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: CompetenceResponse })
@UseGuards(AuthSessionGuard, RolesGuard)
@Roles(IdentityRole.ADMIN, IdentityRole.HR)
export class CompetencesController {
    constructor(private readonly service: CompetenceService) {}

    @Post()
    @ApiOperation({ summary: 'Create a competence' })
    @ApiBody({ type: CreateCompetenceDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: CompetenceResponse })
    @ApiCreateAndUpdateErrorResponses()
    async create(
        @Body() dto: CreateCompetenceDto,
    ): Promise<CompetenceResponse> {
        const created = await this.service.create({
            code: dto.code,
            title: dto.title,
            description: dto.description,
        });
        return CompetenceHttpMapper.toResponse(created);
    }

    @Get()
    @Roles(
        IdentityRole.ADMIN,
        IdentityRole.HR,
        IdentityRole.MANAGER,
        IdentityRole.EMPLOYEE,
    )
    @ApiOperation({ summary: 'Search competences' })
    @ApiQuery({ type: CompetenceQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CompetenceResponse,
        isArray: true,
    })
    @ApiListReadErrorResponses()
    async search(
        @Query() query: CompetenceQueryDto,
    ): Promise<CompetenceResponse[]> {
        const items = await this.service.search(query);
        return items.map(CompetenceHttpMapper.toResponse);
    }

    @Get(':id')
    @Roles(
        IdentityRole.ADMIN,
        IdentityRole.HR,
        IdentityRole.MANAGER,
        IdentityRole.EMPLOYEE,
    )
    @ApiOperation({ summary: 'Get competence by id' })
    @ApiParam({ name: 'id', type: 'number', required: true })
    @ApiResponse({ status: HttpStatus.OK, type: CompetenceResponse })
    @ApiReadErrorResponses()
    async getById(@Param('id') id: string): Promise<CompetenceResponse> {
        const competence = await this.service.getById(Number(id));
        return CompetenceHttpMapper.toResponse(competence);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update competence' })
    @ApiParam({ name: 'id', type: 'number', required: true })
    @ApiBody({ type: UpdateCompetenceDto })
    @ApiResponse({ status: HttpStatus.OK, type: CompetenceResponse })
    @ApiCreateAndUpdateErrorResponses()
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateCompetenceDto,
    ): Promise<CompetenceResponse> {
        const updated = await this.service.update(Number(id), dto);
        return CompetenceHttpMapper.toResponse(updated);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete competence' })
    @ApiParam({ name: 'id', type: 'number', required: true })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async delete(@Param('id') id: string): Promise<void> {
        await this.service.delete(Number(id));
    }

    @Post(':id/positions')
    @ApiOperation({ summary: 'Attach competence to position' })
    @ApiParam({ name: 'id', type: 'number', required: true })
    @ApiBody({ type: AttachPositionCompetenceDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: Number, isArray: true })
    @ApiCreateAndUpdateErrorResponses()
    async attachPosition(
        @Param('id') id: string,
        @Body() dto: AttachPositionCompetenceDto,
    ): Promise<number[]> {
        return this.service.attachPosition(Number(id), dto.positionId);
    }

    @Delete(':id/positions/:positionId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Detach competence from position' })
    @ApiParam({ name: 'id', type: 'number', required: true })
    @ApiParam({ name: 'positionId', type: 'number', required: true })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async detachPosition(
        @Param('id') id: string,
        @Param('positionId') positionId: string,
    ): Promise<void> {
        await this.service.detachPosition(Number(id), Number(positionId));
    }

    @Get(':id/positions')
    @ApiOperation({ summary: 'List positions linked to competence' })
    @ApiParam({ name: 'id', type: 'number', required: true })
    @ApiResponse({ status: HttpStatus.OK, type: Number, isArray: true })
    @ApiListReadErrorResponses()
    async listPositions(@Param('id') id: string): Promise<number[]> {
        return this.service.listPositions(Number(id));
    }

    @Post(':id/question-templates')
    @ApiOperation({ summary: 'Attach competence to question template' })
    @ApiParam({ name: 'id', type: 'number', required: true })
    @ApiBody({ type: AttachQuestionTemplateCompetenceDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: Number, isArray: true })
    @ApiCreateAndUpdateErrorResponses()
    async attachQuestionTemplate(
        @Param('id') id: string,
        @Body() dto: AttachQuestionTemplateCompetenceDto,
    ): Promise<number[]> {
        return this.service.attachQuestionTemplate(
            Number(id),
            dto.questionTemplateId,
        );
    }

    @Delete(':id/question-templates/:questionTemplateId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Detach competence from question template' })
    @ApiParam({ name: 'id', type: 'number', required: true })
    @ApiParam({ name: 'questionTemplateId', type: 'number', required: true })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async detachQuestionTemplate(
        @Param('id') id: string,
        @Param('questionTemplateId') questionTemplateId: string,
    ): Promise<void> {
        await this.service.detachQuestionTemplate(
            Number(id),
            Number(questionTemplateId),
        );
    }

    @Get(':id/question-templates')
    @ApiOperation({ summary: 'List question templates linked to competence' })
    @ApiParam({ name: 'id', type: 'number', required: true })
    @ApiResponse({ status: HttpStatus.OK, type: Number, isArray: true })
    @ApiListReadErrorResponses()
    async listQuestionTemplates(@Param('id') id: string): Promise<number[]> {
        return this.service.listQuestionTemplates(Number(id));
    }
}
