import type { ReviewQuestionRelationResponseDto } from '@entities/feedback360/review-qiestion-relation/model/types';

export interface Question extends Omit<
    ReviewQuestionRelationResponseDto,
    'createdAt'
> {
    createdAt: Date;
}

export function mapQuestionDtoToModel(
    dto: ReviewQuestionRelationResponseDto,
): Question {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
    };
}
