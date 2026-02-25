import type { ReviewerResponseDto } from '@entities/feedback360/reviewer/model/types';

export interface Reviewer extends Omit<ReviewerResponseDto, 'createdAt'> {
    createdAt: Date;
}

export function mapReviewerDtoToModel(dto: ReviewerResponseDto): Reviewer {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
    };
}
