import { QuestionTemplateResponseDto } from '@entities/library/question-template/model/types';

export interface QuestionTemplate extends Omit<
    QuestionTemplateResponseDto,
    'createdAt' | 'updatedAt' | 'isForSelfassessment'
> {
    createdAt: Date;
    updatedAt: Date;
    isForSelfassessment: boolean;
}

export function mapQuestionTemplateDtoToModel(
    dto: QuestionTemplateResponseDto,
): QuestionTemplate {
    const isForSelfassessment =
        typeof dto.isForSelfassessment === 'string'
            ? dto.isForSelfassessment === 'true'
            : Boolean(dto.isForSelfassessment);

    return {
        ...dto,
        isForSelfassessment,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };
}
