import type { ReviewResponseDto } from '@entities/feedback360/review/model/types';

export interface Review extends Omit<
    ReviewResponseDto,
    'createdAt' | 'updatedAt'
> {
    createdAt: Date;
    updatedAt: Date;
}

export function mapReviewDtoToModel(dto: ReviewResponseDto): Review {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };
}
