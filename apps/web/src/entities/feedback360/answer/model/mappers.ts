import type { AnswerResponseDto } from '@entities/feedback360/answer/model/types';

export interface Answer extends Omit<AnswerResponseDto, 'createdAt'> {
    createdAt: Date;
}

export function mapAnswerDtoToModel(dto: AnswerResponseDto): Answer {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
    };
}
