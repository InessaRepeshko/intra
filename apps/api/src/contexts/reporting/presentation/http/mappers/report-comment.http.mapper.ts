import { ReportCommentDomain } from '../../../domain/report-comment.domain';
import { ReportCommentResponse } from '../models/report-comment.response';

export class ReportCommentHttpMapper {
    static toResponse(comment: ReportCommentDomain): ReportCommentResponse {
        const response = new ReportCommentResponse();
        response.id = comment.id!;
        response.reportId = comment.reportId;
        response.questionId = comment.questionId;
        response.questionTitle = comment.questionTitle;
        response.comment = comment.comment;
        response.respondentCategories = comment.respondentCategories;
        response.commentSentiment = comment.commentSentiment ?? null;
        response.numberOfMentions = comment.numberOfMentions;
        response.createdAt = comment.createdAt!;
        return response;
    }
}
