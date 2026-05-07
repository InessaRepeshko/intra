import { ReportComment } from '@entities/reporting/individual-report-comment/model/mappers';
import { CommentSentiment } from '@intra/shared-kernel';

export type CommentColorTier = 1 | 2 | 3 | 4;

export function getMentionsTier(count: number): CommentColorTier {
    if (count <= 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4;
}

export function getMentionsBgClass(count: number): string {
    switch (getMentionsTier(count)) {
        case 1:
            return '';
        case 2:
            return 'bg-green-100';
        case 3:
            return 'bg-green-200';
        case 4:
            return 'bg-green-300';
    }
}

export interface GroupedComments {
    positive: ReportComment[];
    negative: ReportComment[];
}

function sortBucket(bucket: ReportComment[]): ReportComment[] {
    return bucket.slice().sort((a, b) => {
        if (b.numberOfMentions !== a.numberOfMentions) {
            return b.numberOfMentions - a.numberOfMentions;
        }
        return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });
}

export function groupCommentsBySentiment(
    comments: ReportComment[],
): GroupedComments {
    const positive: ReportComment[] = [];
    const negative: ReportComment[] = [];

    for (const comment of comments) {
        if (comment.commentSentiment === CommentSentiment.POSITIVE) {
            positive.push(comment);
        } else if (comment.commentSentiment === CommentSentiment.NEGATIVE) {
            negative.push(comment);
        }
    }

    return {
        positive: sortBucket(positive),
        negative: sortBucket(negative),
    };
}
