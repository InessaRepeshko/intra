import { Card } from '@shared/components/ui/card';
import { formatNumber } from '@shared/lib/utils/format-number';
import {
    ChartColumnStacked,
    Eye,
    FileText,
    Percent,
    UserRound,
    UserRoundPen,
    UsersRound,
} from 'lucide-react';
import { StrategicReport } from '../model/mappers';

export function CycleParticipationStatsCard({
    report,
}: {
    report: StrategicReport;
}) {
    if (!report) {
        return <span className="text-muted-foreground">None</span>;
    }

    return (
        <Card className="flex flex-col sm:flex-nowrap items-start text-center sm:text-left justify-start gap-3 p-4 w-full max-w-[500px]">
            {report && (
                <h3 className="flex flex-wrap items-center justify-center sm:justify-start gap-x-1 text-lg text-muted-foreground">
                    <ChartColumnStacked className="shrink-0 h-3.5 w-3.5" />
                    <span className="font-medium text-foreground break-words">
                        Engagement & Participation
                    </span>
                </h3>
            )}
            <div className="flex flex-wrap gap-4 w-full min-w-0 justify-between items-start sm:gap-2">
                <div className="flex flex-col gap-2 justify-start min-w-[180px] flex-1">
                    <div className="flex flex-wrap items-center justify-start gap-x-1 text-sm w-full">
                        <UserRound className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="flex items-center gap-1 text-foreground font-medium">
                            {report.rateeCount}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                            ratees
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-start gap-x-1 text-sm w-full">
                        <UsersRound className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="flex items-center gap-1 text-foreground font-medium">
                            {report.respondentCount}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                            respondents
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-start gap-x-1 text-sm w-full">
                        <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="flex items-center gap-1 text-foreground">
                            <span className="font-medium">
                                {report.answerCount}
                            </span>
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                            answers
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-start gap-x-1 text-sm w-full">
                        <Eye className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="flex items-center gap-1 text-foreground">
                            <span className="font-medium">
                                {report.reviewerCount}
                            </span>
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                            reviewers
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 justify-start min-w-[180px] flex-1">
                    <div className="flex flex-wrap items-center justify-start gap-x-1 text-sm text-muted-foreground w-full">
                        <UserRoundPen className="h-3.5 w-3.5 shrink-0 text-amber-700" />
                        <span className="flex items-center gap-1 text-amber-700">
                            <span className="font-medium text-amber-700">
                                {formatNumber(report.turnoutAvgPctOfRatees)}
                            </span>
                            <Percent className="h-3.5 w-3.5 shrink-0 text-amber-700" />
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                            turnout of ratees
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-start gap-x-1 text-sm text-muted-foreground w-full">
                        <UserRoundPen className="h-3.5 w-3.5 shrink-0 text-blue-700" />
                        <span className="flex items-center gap-1 text-blue-700">
                            <span className="font-medium text-blue-700">
                                {formatNumber(report.turnoutAvgPctOfTeams)}
                            </span>
                            <Percent className="h-3.5 w-3.5 shrink-0 text-blue-700" />
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                            turnout of teams
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-start gap-x-1 text-sm text-muted-foreground w-full">
                        <UserRoundPen className="h-3.5 w-3.5 shrink-0 text-violet-700" />
                        <span className="flex items-center gap-1 text-violet-700">
                            <span className="font-medium text-violet-700">
                                {formatNumber(report.turnoutAvgPctOfOthers)}
                            </span>
                            <Percent className="h-3.5 w-3.5 shrink-0 text-violet-700" />
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                            turnout of others
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
