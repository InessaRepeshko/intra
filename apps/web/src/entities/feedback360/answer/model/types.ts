import {
    AnswerDto,
    AnswerSearchQuery as AnswerFilterQuery,
    AnswerResponseDto,
    CreateAnswerPayload,
} from '@intra/shared-kernel';

export type { AnswerDto, AnswerFilterQuery, AnswerResponseDto };

export type CreateAnswerToReviewPayload = Omit<CreateAnswerPayload, 'reviewId'>;
