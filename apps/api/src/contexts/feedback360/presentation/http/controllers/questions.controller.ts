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
} from 'src/common/documentation/api.error.responses.decorator';
import { ReviewService } from '../../../application/services/review.service';
import { CreateQuestionDto } from '../dto/questions/create-question.dto';
import { QuestionQueryDto } from '../dto/questions/question-query.dto';
import { QuestionHttpMapper } from '../mappers/question.http.mapper';
import { QuestionResponse } from '../models/question.response';

@ApiTags('Feedback360 / Questions')
@Controller('feedback360/questions')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: QuestionResponse })
export class QuestionsController {
    constructor(private readonly reviews: ReviewService) {}

    @Post()
    @ApiOperation({ summary: 'Create review question' })
    @ApiBody({ type: CreateQuestionDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: QuestionResponse })
    @ApiCreateAndUpdateErrorResponses()
    async create(@Body() dto: CreateQuestionDto): Promise<QuestionResponse> {
        const created = await this.reviews.createQuestion(dto);
        return QuestionHttpMapper.toResponse(created);
    }

    @Get()
    @ApiOperation({ summary: 'List review questions' })
    @ApiQuery({ type: QuestionQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: QuestionResponse,
        isArray: true,
        description: 'Default sort by ascending id',
    })
    @ApiListReadErrorResponses()
    async search(
        @Query() query: QuestionQueryDto,
    ): Promise<QuestionResponse[]> {
        const items = await this.reviews.listQuestions(query);
        return items.map(QuestionHttpMapper.toResponse);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete review question' })
    @ApiParam({ name: 'id', description: 'Question id', type: 'number' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async delete(@Param('id') id: string): Promise<void> {
        await this.reviews.deleteQuestion(Number(id));
    }
}
