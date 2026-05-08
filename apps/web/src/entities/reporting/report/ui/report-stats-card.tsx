import { Card } from '@shared/components/ui/card';
import { formatNumber } from '@shared/lib/utils/format-number';
import {
    BookmarkCheck,
    ChartColumnStacked,
    Percent,
    UserRoundPen,
} from 'lucide-react';
import { Report } from '../model/mappers';

export function ReportStatsCard({ report }: { report: Report }) {
    if (!report) {
        return <span className="text-muted-foreground">None</span>;
    }

    return (
        <Card className="flex flex-col sm:flex-nowrap items-start text-center sm:text-left justify-start gap-3 p-4 w-full max-w-[500px]">
            {report && (
                <h3 className="flex flex-wrap items-center justify-center sm:justify-start gap-x-1 text-lg text-muted-foreground">
                    <ChartColumnStacked className="shrink-0 h-3.5 w-3.5" />
                    <span className="font-medium text-foreground break-words">
                        360° Feedback Summary
                    </span>
                </h3>
            )}
            <div className="flex flex-wrap gap-4 w-full min-w-0 justify-between items-start m-auto sm:gap-2">
                <div className="flex flex-col gap-2 justify-start min-w-[180px] flex-1">
                    {report.questionSummaryTotals
                        ?.percentageBySelfAssessment && (
                        <div className="flex flex-wrap items-center justify-start gap-x-1 text-sm text-muted-foreground w-full">
                            <BookmarkCheck className="h-3.5 w-3.5 shrink-0 text-amber-700" />
                            <span className="flex items-center gap-1 text-amber-700">
                                <span className="font-medium">
                                    {formatNumber(
                                        report.competenceSummaryTotals
                                            ?.percentageBySelfAssessment,
                                    )}
                                </span>
                                <Percent className="h-3.5 w-3.5 shrink-0" />
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                                self rating
                            </span>
                        </div>
                    )}

                    {report.questionSummaryTotals?.percentageByTeam && (
                        <div className="flex flex-wrap items-center justify-start gap-x-1 text-sm text-muted-foreground w-full">
                            <BookmarkCheck className="h-3.5 w-3.5 shrink-0 text-blue-700" />
                            <span className="flex items-center gap-1 text-blue-700">
                                <span className="font-medium">
                                    {formatNumber(
                                        report.competenceSummaryTotals
                                            ?.percentageByTeam,
                                    )}
                                </span>
                                <Percent className="h-3.5 w-3.5 shrink-0" />
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                                team rating
                            </span>
                        </div>
                    )}

                    {report.questionSummaryTotals?.percentageByOther && (
                        <div className="flex flex-wrap items-center justify-start gap-x-1 text-sm text-muted-foreground w-full">
                            <BookmarkCheck className="h-3.5 w-3.5 shrink-0 text-violet-700" />
                            <span className="flex items-center gap-1 text-violet-700">
                                <span className="font-medium">
                                    {formatNumber(
                                        report.competenceSummaryTotals
                                            ?.percentageByOther,
                                    )}
                                </span>
                                <Percent className="h-3.5 w-3.5 shrink-0" />
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                                others rating
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2 justify-start min-w-[180px] flex-1">
                    {report.turnoutPctOfTeam && (
                        <div className="flex flex-wrap items-center justify-start gap-x-1 text-sm text-muted-foreground w-full">
                            <UserRoundPen className="h-3.5 w-3.5 shrink-0" />
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <span className="font-medium text-foreground">
                                    {formatNumber(report.turnoutPctOfTeam)}
                                </span>
                                <Percent className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                                turnout of team
                            </span>
                        </div>
                    )}

                    {report.turnoutPctOfOther && (
                        <div className="flex flex-wrap items-center justify-start gap-x-1 text-sm text-muted-foreground w-full">
                            <UserRoundPen className="h-3.5 w-3.5 shrink-0" />
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <span className="font-medium text-foreground">
                                    {formatNumber(report.turnoutPctOfOther)}
                                </span>
                                <Percent className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                                turnout of others
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
