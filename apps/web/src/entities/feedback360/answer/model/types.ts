import { RespondentCategory } from '@entities/feedback360/respondent/model/types';
import {
    ANSWER_TYPES as ANSWER_TYPES_ENUM_VALUES,
    AnswerDto,
    AnswerSearchQuery as AnswerFilterQuery,
    AnswerResponseDto,
    AnswerType,
    CreateAnswerPayload,
} from '@intra/shared-kernel';

export { ANSWER_TYPES_ENUM_VALUES, AnswerType, RespondentCategory };

export type { AnswerDto, AnswerFilterQuery, AnswerResponseDto };

export type CreateAnswerToReviewPayload = Omit<CreateAnswerPayload, 'reviewId'>;
