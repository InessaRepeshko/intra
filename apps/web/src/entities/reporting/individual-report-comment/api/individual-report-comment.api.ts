import { apiClient } from '@/shared/api/api-client';
import type {
    CreateReportCommentPayload,
    ReportCommentResponseDto,
} from '@entities/reporting/individual-report-comment/model/types';

const COMMENTS_BASE = (reportId: number) =>
    `/reporting/reports/${reportId}/comments`;
const COMMENT_BASE = (commentId: number) =>
    `/reporting/reports/comments/${commentId}`;
const ANSWERS_BASE = (reviewId: number) =>
    `/feedback360/reviews/${reviewId}/answers`;

export async function fetchReportComments(
    reportId: number,
): Promise<ReportCommentResponseDto[]> {
    const { data } = await apiClient.get<ReportCommentResponseDto[]>(
        COMMENTS_BASE(reportId),
    );
    return data;
}

export async function fetchReportCommentById(
    commentId: number,
): Promise<ReportCommentResponseDto> {
    const { data } = await apiClient.get<ReportCommentResponseDto>(
        COMMENT_BASE(commentId),
    );
    return data;
}

export async function createReportComment(
    reportId: number,
    payload: CreateReportCommentPayload,
): Promise<ReportCommentResponseDto> {
    const { data } = await apiClient.post<ReportCommentResponseDto>(
        COMMENTS_BASE(reportId),
        payload,
    );
    return data;
}
