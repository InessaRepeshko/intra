import type {
    CreateQuestionPayload,
    QuestionResponseDto,
    QuestionTemplateFilterQuery,
} from '@entities/feedback360/question/model/types';
import { apiClient } from '@shared/api/api-client';

const QUESTION_BASE = '/feedback360/questions';

export async function fetchQuestions(
    params?: QuestionTemplateFilterQuery,
): Promise<QuestionResponseDto[]> {
    const { data } = await apiClient.get<QuestionResponseDto[]>(QUESTION_BASE, {
        params,
    });
    return data;
}

export async function createQuestion(
    payload: CreateQuestionPayload,
): Promise<QuestionResponseDto> {
    const { data } = await apiClient.post<QuestionResponseDto>(
        QUESTION_BASE,
        payload,
    );
    return data;
}

export async function deleteQuestion(id: number): Promise<void> {
    await apiClient.delete(`${QUESTION_BASE}/${id}`);
}
