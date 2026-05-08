import { RespondentCategory } from '@entities/feedback360/respondent/model/types';
import {
    AnswerDto,
    AnswerSearchQuery as AnswerFilterQuery,
    AnswerResponseDto,
    CreateAnswerPayload,
} from '@intra/shared-kernel';

export { RespondentCategory };

export type { AnswerDto, AnswerFilterQuery, AnswerResponseDto };

export type CreateAnswerToReviewPayload = Omit<CreateAnswerPayload, 'reviewId'>;
