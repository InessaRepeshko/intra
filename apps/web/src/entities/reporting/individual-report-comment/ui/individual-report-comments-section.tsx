'use client';

import { useReportCommentsQuery } from '@entities/reporting/individual-report-comment/api/individual-report-comment.queries';
import { groupCommentsBySentiment } from '@entities/reporting/individual-report-comment/lib/comment-color';
import { CommentsColorLegend } from '@entities/reporting/individual-report-comment/ui/comments-color-legend';
import { CommentsSentimentTable } from '@entities/reporting/individual-report-comment/ui/comments-sentiment-table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { useMemo } from 'react';

export function IndividualReportCommentsSection({
    reportId,
}: {
    reportId: number;
}) {
    const {
        data: reportComments,
        isLoading,
        isError,
        error,
    } = useReportCommentsQuery(reportId);

    const grouped = useMemo(
        () => groupCommentsBySentiment(reportComments ?? []),
        [reportComments],
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Feedbacks</CardTitle>
                <CardDescription>
                    All of the comments are depersonalized without loss of
                    meaning. Therefore, if more than one colleague noted the
                    same strength or area of development, we will highlight it
                    with a color according to the scale below.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
                <CommentsColorLegend />

                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                        <Spinner />
                    </div>
                )}

                {isError && error.message.includes('404') && (
                    <div className="flex flex-col items-center justify-center py-5 text-center">
                        <h3 className="text-sm text-muted-foreground">
                            No report comments found
                        </h3>
                    </div>
                )}

                {isError && !error.message.includes('404') && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <h3 className="text-lg font-semibold text-destructive">
                            Failed to load report comments
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Please try refreshing the page.
                        </p>
                    </div>
                )}

                {!isLoading && !isError && (
                    <CommentsSentimentTable group={grouped} />
                )}
            </CardContent>
        </Card>
    );
}
