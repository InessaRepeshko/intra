import { RespondentCategory } from '../../../feedback360/enums/respondent-category.enum';
import { CommentSentiment } from '../../enums/comment-sentiment.enum';

export type CreateReportCommentPayload = {
    reportId: number;
    questionId: number;
    questionTitle: string;
    comment: string;
    respondentCategories: RespondentCategory[];
    commentSentiment?: CommentSentiment | null;
    numberOfMentions: number;
};
