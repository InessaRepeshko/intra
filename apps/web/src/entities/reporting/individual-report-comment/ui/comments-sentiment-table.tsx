import {
    GroupedComments,
    getMentionsBgClass,
} from '@entities/reporting/individual-report-comment/lib/comment-color';
import { ReportComment } from '@entities/reporting/individual-report-comment/model/mappers';
import { cn } from '@shared/lib/utils/cn';

interface CommentsSentimentTableProps {
    group: GroupedComments;
}

function CommentColumn({
    heading,
    comments,
}: {
    heading: string;
    comments: ReportComment[];
}) {
    return (
        <div className="flex flex-col bg-card">
            <div className="border-b bg-muted/40 px-4 py-2 text-center text-sm font-medium text-muted-foreground">
                {heading}
            </div>
            {comments.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground italic">
                    No comments
                </div>
            ) : (
                comments.map((comment, idx) => (
                    <div
                        key={`${comment.questionId}-${idx}`}
                        className={cn(
                            'border-b px-4 py-2.5 text-sm text-foreground last:border-b-0',
                            getMentionsBgClass(comment.numberOfMentions),
                        )}
                    >
                        {comment.comment}
                    </div>
                ))
            )}
        </div>
    );
}

export function CommentsSentimentTable({ group }: CommentsSentimentTableProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px overflow-hidden rounded-md border bg-border">
            <CommentColumn
                heading="What he/she does well"
                comments={group.positive}
            />
            <CommentColumn heading="Make better" comments={group.negative} />
        </div>
    );
}
