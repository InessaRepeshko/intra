import { QuestionResponseDto } from '@entities/feedback360/question/model/types';

export interface Question extends Omit<QuestionResponseDto, 'createdAt'> {
    createdAt: Date;
}

export function mapQuestionDtoToModel(dto: QuestionResponseDto): Question {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
    };
}
