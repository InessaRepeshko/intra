import { RespondentCategory } from '../../../feedback360/enums/respondent-category.enum';
import { CommentSentiment } from '../../enums/comment-sentiment.enum';

export interface ReportCommentBaseDto<TDate = Date> {
    reportId: number;
    questionId: number;
    questionTitle: string;
    comment: string;
    respondentCategories: RespondentCategory[];
    commentSentiment?: CommentSentiment | null;
    numberOfMentions: number;
    createdAt: TDate;
}

export type ReportCommentDto = ReportCommentBaseDto<Date>;

export type ReportCommentResponseDto = ReportCommentBaseDto<string>;
