import {
    ReportTextAnswerDto,
    RESPONDENT_CATEGORIES,
    RespondentCategory,
} from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';

export class TextAnswerResponse implements ReportTextAnswerDto {
    @ApiProperty({
        example: 101,
        description: 'Question identifier',
        type: 'number',
        required: true,
    })
    questionId!: number;

    @ApiProperty({
        example: 'Handles conflicts constructively',
        description: 'Related question title',
        type: 'string',
        nullable: true,
        required: false,
    })
    questionTitle?: string | null;

    @ApiProperty({
        enum: RESPONDENT_CATEGORIES,
        example: RespondentCategory.TEAM,
        description: 'Category of respondent who provided the text answer',
        required: true,
    })
    respondentCategory!: RespondentCategory;

    @ApiProperty({
        example: 'Always listens before giving advice.',
        description: 'Text value provided by respondent',
        type: 'string',
        required: true,
    })
    textValue!: string;
}
