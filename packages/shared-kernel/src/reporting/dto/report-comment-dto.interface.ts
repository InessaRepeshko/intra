import { RespondentCategory } from 'src/feedback360/enums/respondent-category.enum';
import { CommentSentiment } from '../enums/comment-sentiment.enum';

export interface ReportCommentDto {
    id: number;
    reportId: number;
    questionId: number;
    questionTitle: string;
    comment: string;
    respondentCategory: RespondentCategory;
    commentSentiment?: CommentSentiment | null;
    numberOfMentions: number;
    createdAt: Date;
}
