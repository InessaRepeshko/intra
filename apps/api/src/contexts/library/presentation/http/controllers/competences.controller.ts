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
import { CompetenceService } from '../../../application/services/competence.service';
import { CreateCompetenceDto } from '../dto/competences/create-competence.dto';
import { CompetenceResponse } from '../models/competence.response';
import { CompetenceHttpMapper } from '../mappers/competence.http.mapper';
import { CompetenceQueryDto } from '../dto/competences/competence-query.dto';
import { UpdateCompetenceDto } from '../dto/competences/update-competence.dto';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';

@ApiTags('Library / Competences')
@Controller('library/competences')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: CompetenceResponse })
export class CompetencesController {
  constructor(private readonly service: CompetenceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a competence' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CompetenceResponse })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateCompetenceDto): Promise<CompetenceResponse> {
    const created = await this.service.create({
      code: dto.code,
      title: dto.title,
      description: dto.description,
    });
    return CompetenceHttpMapper.toResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'Search competences' })
  @ApiResponse({ status: HttpStatus.OK, type: CompetenceResponse, isArray: true })
  @ApiListReadErrorResponses()
  async search(@Query() query: CompetenceQueryDto): Promise<CompetenceResponse[]> {
    const items = await this.service.search(query);
    return items.map(CompetenceHttpMapper.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get competence by id' })
  @ApiResponse({ status: HttpStatus.OK, type: CompetenceResponse })
  @ApiReadErrorResponses()
  async getById(@Param('id') id: string): Promise<CompetenceResponse> {
    const competence = await this.service.getById(Number(id));
    return CompetenceHttpMapper.toResponse(competence);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update competence' })
  @ApiResponse({ status: HttpStatus.OK, type: CompetenceResponse })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateCompetenceDto): Promise<CompetenceResponse> {
    const updated = await this.service.update(Number(id), dto);
    return CompetenceHttpMapper.toResponse(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete competence' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiDeletionErrorResponses()
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(Number(id));
  }
}

