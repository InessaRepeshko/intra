import { StrategicReport } from '@entities/reporting/strategic-report/model/mappers';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { formatNumber } from '@shared/lib/utils/format-number';
import { CycleStatsCard } from '@shared/ui/cycle-stats-card';
import {
    Award,
    Bookmark,
    Building2,
    FileText,
    UserRound,
    UsersRound,
} from 'lucide-react';

export function CycleStatsCards({ report }: { report: StrategicReport }) {
    if (!report) {
        return <span className="text-muted-foreground">None</span>;
    }

    return (
        <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
            <CardHeader className="items-center pb-0">
                <CardTitle>Survey Scope & Engagement</CardTitle>
                <CardDescription>
                    Summary of the 360° feedback cycle scale, showing the total
                    participation of ratees and respondents across different
                    organizational layers.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row flex-wrap gap-8 w-full justify-around items-center mb-4">
                <CycleStatsCard
                    title={'Ratees'}
                    numericValue={formatNumber(report.rateeCount, 0) ?? '-'}
                    icon={UserRound}
                    textColor="text-emerald-300"
                />
                <CycleStatsCard
                    title={'Respondents'}
                    numericValue={
                        formatNumber(report.respondentCount, 0) ?? '-'
                    }
                    icon={UsersRound}
                    textColor="text-sky-300"
                />
                <CycleStatsCard
                    title={'Teams'}
                    numericValue={formatNumber(report.teamCount, 0) ?? '-'}
                    icon={Building2}
                    textColor="text-indigo-300"
                />
                <CycleStatsCard
                    title={'Answers'}
                    numericValue={formatNumber(report.answerCount, 0) ?? '-'}
                    icon={FileText}
                    textColor="text-fuchsia-300"
                />
                <CycleStatsCard
                    title={'Positions'}
                    numericValue={formatNumber(report.positionCount, 0) ?? '-'}
                    icon={Award}
                    textColor="text-pink-300"
                />
                <CycleStatsCard
                    title={'Competencies'}
                    numericValue={
                        formatNumber(report.competenceCount, 0) ?? '-'
                    }
                    icon={Bookmark}
                    textColor="text-rose-300"
                />
            </CardContent>
        </Card>
    );
}
