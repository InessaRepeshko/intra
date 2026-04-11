import { CategoryBadge } from '@entities/feedback360/respondent/ui/category-badge';
import { Card } from '@shared/components/ui/card';
import { format } from 'date-fns';
import { Calendar, FileText, RefreshCcw, Users } from 'lucide-react';
import { Report } from '../model/mappers';

interface IndividualReportCycleStatsCardProps {
    report: Report;
    cycleTitle: string;
}

export function IndividualReportCycleStatsCard({
    report,
    cycleTitle,
}: IndividualReportCycleStatsCardProps) {
    if (!report) {
        return <span className="text-muted-foreground">None</span>;
    }

    return (
        <Card className="flex flex-col sm:flex-row sm:flex-nowrap items-center text-center sm:text-left justify-between p-4 w-full max-w-[500px]">
            <div className="flex flex-col gap-3 flex-1 min-w-0 justify-center">
                {cycleTitle && (
                    <h3 className="flex flex-wrap items-center justify-center sm:justify-start gap-x-1 text-lg text-muted-foreground">
                        <RefreshCcw className="shrink-0 h-3.5 w-3.5" />
                        <span className="font-medium text-foreground break-words">
                            {cycleTitle}
                        </span>
                    </h3>
                )}

                {report.createdAt && (
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span className="font-medium text-muted-foreground break-words">
                            {format(report.createdAt, 'MMM dd, yyyy')}
                        </span>
                    </div>
                )}

                {report.respondentCategories && (
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                            {report.respondentCount}
                        </span>
                        <span className="text-muted-foreground whitespace-pre-wrap">
                            respondents
                        </span>
                        <span className="text-muted-foreground whitespace-pre-wrap">
                            in categories
                        </span>
                        {report.respondentCategories.map((category) => (
                            <CategoryBadge key={category} category={category} />
                        ))}
                    </div>
                )}

                {report.answerCount > 0 && (
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-1 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                            {report.answerCount}
                        </span>
                        <span className="text-muted-foreground whitespace-pre-wrap">
                            answers
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
}
